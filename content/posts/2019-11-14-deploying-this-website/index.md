---
title: Deploying using Gitlab CI and SSH
slug: "deploying-this-website"
date: 2019-11-14T19:38:06+13:00
emoji: 💻
metaDescription: "How to set up a GitLab pipeline to deploy a website with Hugo."
prism: "true"
---

Setting up a Continuous Integration (CI) pipeline can be tricky and hard to debug. Here are some notes I made during my process!

## Step 1: SSH Private Key

This step is so that your CI pipeline can connect to and run commands on your server!

If you don't already have a key-pair, log into your VPS and run `ssh-keygen`. This will take you through the process of generating one.
Assuming you ran the defaults you should be able to find your key-pair at `~/.ssh/`.

Head over to your repository on Gitlab and into __Settings -> CI / CD Settings__. Expand the variables section and create a variable called, for example, __SSH_PRIVATE_KEY__. The value of this variable is the entire contents of the file `~/.ssh/id_rsa`. I tend to `cat` the file and copy the contents across, but do whatever works best for you.

## Step 2: SSH Public Key

This step is so that your server can pull from your Gitlab repository, even if it is private!

`cat` your `~/.ssh/id_rsa.pub` (public key) and paste the contents into the big box at the top of this page over here `https://gitlab.com/profile/keys`. Don't forget to give it a descriptive title in case you have multiple.

## Step 3: Git Remote

If you are like me, when I cloned my repository onto my server I ended up with HTTPS remotes like this:

```
$ git remote -v
origin  https://gitlab.com/Finnito/blog (fetch)
origin  https://gitlab.com/Finnito/blog (push)
```

But this authentication doesn't use your public key, it tries to use your password. This doesn't work in CI and you may see an error like this:

```
fatal: could not read Username for 'https://gitlab.com': No such device or address
```

To remedy this, simply change the remote of your repository to use SSH like so:

```
git remote set-url origin git@gitlab.com:Finnito/blog.git
$ git remote -v
origin  git@gitlab.com:Finnito/blog.git (fetch)
origin  git@gitlab.com:Finnito/blog.git (push)
```

Now, your git operations should use public key authentication and work nice and smoothly in your Gitlab CI.

## Step 4: Putting It All Together

Now you are ready to use your __SSH_PRIVATE_KEY__ variable in your `.gitlab-ci.yml` file to connect to your server, and you are ready for your server to connect to Gitlab back and get set up. Here is my `.gitlab-ci.yml` as an example.

```
stages:
  - deploy

variables:
  GIT_SUBMODULE_STRATEGY: recursive

deploy:
  stage: deploy
  before_script:
  - apt-get update -qq
  - apt-get install -qq git
  - 'which ssh-agent || ( apt-get install -qq openssh-client )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config'
  script:
    - ssh finn@my.hidden.ip.address "cd /srv/finn.lesueur.nz/ && git checkout master && git pull origin master --recurse-submodules && exit"
    - ssh finn@my.hidden.ip.address "cd /srv/finn.lesueur.nz/ && git submodule update --remote && exit"
    - ssh finn@my.hidden.ip.address "cd /srv/finn.lesueur.nz/ && rm -rf public/ && exit"
    - ssh finn@my.hidden.ip.address "cd /srv/finn.lesueur.nz/ && hugo && exit"
  only:
    - master
  artifacts:
    paths:
    - public
```

Good luck!
