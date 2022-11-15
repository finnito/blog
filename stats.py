#!/usr/bin/env python3

import gpxpy
import json
import os
from pathlib import Path
import polyline
import datetime
import pytz

# Find all GPX files
paths = []
for subdir, dirs, files in os.walk(Path.cwd() / "content"):
    for file in files:
        filepath = subdir + os.sep + file
        if filepath.endswith(".gpx"):
            paths.append(filepath)

# Iterate files and build summary
# data files.
for file in paths:
    static_file = "static/tracks/" + file.split("/")[-1].split(".gpx")[0] + ".json"
    data_file = "data/gpx/" + file.split("/")[-1].split(".gpx")[0] + ".json"

    # if (not os.path.exists(data_file)):
    print(file)
    gpx_file = open(file, 'r')
    gpx = gpxpy.parse(gpx_file)

    elevation_data = gpx.get_uphill_downhill()
    moving_data = gpx.get_moving_data(stopped_speed_threshold=0.1)
    duration = gpx.get_duration()

    distances = []
    dist = 0
    distance_from_start = 0
    previous_point = None
    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                if previous_point is not None:
                    dist = point.distance_3d(previous_point)
                if dist is not None:
                    distance_from_start += float(dist)
                    # if (distance_from_start - distances[-1]) > 10:
                    distances.append(round(distance_from_start))
                    previous_point = point

    elevation_graph_data = []
    # dist = 0
    points = []
    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                points.append((point.latitude, point.longitude))
                elevation_graph_data.append((point.elevation))
                # print(point, elevation_graph_data)
                # exit()
    print(len(elevation_graph_data))
    line = polyline.encode(points)

    # 2020-02-10 20:26:33+00:00
    dte = gpx.get_time_bounds().start_time
    # dte = datetime.strptime("%Y-%m-%d %H:%M-%S%z", gpx.get_time_bounds().start_time)
    print(dte.astimezone(tz=pytz.timezone("Pacific/Auckland")))

    # Get Waypoints
    waypoints = []
    for waypoint in gpx.waypoints:
        waypoints.append([waypoint.latitude, waypoint.longitude, waypoint.name])
        print(f'waypoint {waypoint.name} -> ({waypoint.latitude},{waypoint.longitude})')

    data                        = {}
    data["stats"]               = {}
    data["stats"]["name"]       = gpx.tracks[0].name
    data["stats"]["date"]       = dte.astimezone(tz=pytz.timezone("Pacific/Auckland")).strftime("%a %b %-d, %Y")
    data["stats"]["uphill"]     = round(elevation_data.uphill)
    data["stats"]["downhill"]   = round(elevation_data.downhill)
    data["stats"]["distance"]   = round(moving_data.moving_distance, 2)
    data["stats"]["duration"]   = round(duration)
    data["stats"]["pace"]       = round(((moving_data.moving_distance/1000) / duration * 3600), 3)
    data["stats"]["polyline"]   = line
    data["stats"]["waypoints"]  = waypoints
    

    # data_file = "data/gpx/" + file.split("/")[-1].split(".gpx")[0] + ".json"
    with open(data_file, "w") as out:
        out.write(json.dumps(data))

    with open(static_file, "w") as out:
        out.write(json.dumps(data))
