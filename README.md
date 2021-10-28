## Docker plugin for Cockpit
So you can manage your docker containers from Cockpit

## How to setup ?

### 1) Install cockpit
First off you need to install cockpit according to [Cockpit docs](https://cockpit-project.org/running.html)

### 2) Get the plugin
You can clone this repository by running 

`git clone https://github.com/mrevjd/cockpit-docker` 

### 3) Install
run the `./install` script

## Manual install as user module 

If you want a more advanced way or want to customize things build it like this: 

```bash 
docker build -t cockpit-docker .

docker run -it \
-v $PWD:/app \
--name cockpit-docker \
cockpit-docker
```

then link the `dist/docker` folder to `~/.local/share/cockpit/docker`

## Manual install as global module
Same as user module but instead of linking to `$HOME/.local/share/cockpit/docker` link to `/usr/share/cockpit/docker` 

## License 
Cockpit is licensed under the GNU Lesser general public license. 
So I'm stuck with that. https://github.com/cockpit-project/cockpit/blob/master/COPYING

## Why the fork?

The Cockpit team stopped caring in version 215, declaring they going 'in favor' of podman. a container system nobody uses instead of the defacto standard. 

the cockpit-podman plugin is currently in development and is far from feature-complete.

that doesnt stop RedHat from killing it ! but its OSS ! So let's fork !
