## Docker plugin for Cockpit
So you can manage your docker containers from Cockpit

## How to setup ?

### 1) Install cockpit
First off you need to install cockpit according to [Cockpit docs](https://cockpit-project.org/running.html)

### 2) Get the plugin
Download tar.gz from releases.

### 3) Install
Move or Copy the downloaded release to the cockpit directory. Eg: `/usr/share/cockpit`
Change to the cockpit directory.
Simply extract:
```
tar xf cockpit-docker.tar.gz -C .
```

## Manual install as user module

### 1) Get the plugin
You can clone this repository by running 

`git clone https://github.com/mrevjd/cockpit-docker` 

### 2) Install
run the `./install` script

## OR

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

## Ubuntu package - YMMV
On Ubuntu 20.04 (and likely others), the cockpit-docker package can still be downloaded and used to retain prior functionality:
```bash
wget https://launchpad.net/ubuntu/+source/cockpit/215-1~ubuntu19.10.1/+build/18889196/+files/cockpit-docker_215-1~ubuntu19.10.1_all.deb
sudo dpkg -i cockpit-docker_215-1~ubuntu19.10.1_all.deb
```

## License 
Cockpit is licensed under the GNU Lesser general public license. 
So I'm stuck with that. https://github.com/cockpit-project/cockpit/blob/master/COPYING

## Why the fork?

The Cockpit team stopped caring in version 215, declaring they going 'in favor' of podman. a container system nobody uses instead of the defacto standard. 

the cockpit-podman plugin is currently in development and is far from feature-complete.

that doesnt stop RedHat from killing it ! but its OSS ! So let's fork !
