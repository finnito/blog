"""Author: Finn LeSueur

Watch for input like this:
fswatch -x0re ".*" -i "\\.md$" ./ | xargs -0 -n 1 python3 sparse-build.py

Script argv look like this:
[
    'sparse-build.py',
    '-d',
    '/full/path/6-total-internal-reflection.md PlatformSpecific Updated IsFile'
]

"""

import subprocess
import sys

def main():
    """ Currently does all the things!
    """

    # Start by parsing the fswatch
    # output into a hash containing
    # useful information.
    raw_event = sys.argv[2]
    event_args = raw_event.split(" ")
    file = event_args[0].split("/")[-1]
    event = {
        "path": event_args[0],
        "type": event_args[3],
        "file": file,
        "folder": "/".join(event_args[0].split("/")[:-1])
    }

    if "public" in event["path"]:
        return

    # Only watch for specific event types.
    if event["type"] in ["Updated", "Created"]:

        # Here only an _index.md file has been updated
        # and therefore we don't need to build any slides.
        # We can simply pass the -h flag to a Hugo-only
        # build.
        if event["path"].endswith(("_index.md", ".css", ".html", ".toml", ".txt")):
            subprocess.run(
                [
                    "rm -rf public/ && \
                    hugo --buildDrafts --config=config-dev.toml"
                ],
                shell=True,
                check=False
            )

            subprocess.run(
                [
                    'terminal-notifier \
                    -group "com.finnlesueur.blog" \
                    -title "Blog" \
                    -message "Build complete!" \
                    -appIcon http://finn.test/favicon.png'
                ],
                shell=True,
                check=False
            )

            subprocess.run(
                [
                    'bash reload-safari.sh'
                ],
                shell=True,
                check=False
            )

            

        # Something else unforeseen could have been
        # changed. Ignore it.
        else:
            pass

if __name__ == "__main__":
    main()
