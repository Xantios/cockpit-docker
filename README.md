## cockpit-docker

The Cockpit team stopped caring in version 215, declaring they going 'in favor' of podman. a container system nobody uses instead of the defacto standard. 

the cockpit-podman plugin is currently in development and is far from feature-complete.

that doesnt stop RedHat from killing it ! but its OSS ! So lets fork !

## Mods

The regular build system used is a convulated makefile with a lot of stuff goging on, but we obviously only want the docker part up and running so i wrote a (how ironicly) dockerfile to build a quick NodeJS enviroment just run ```./run -f``` the first time (see run file)

## Install

```bash
mkdir -p ~/.local/share/cockpit
mkdir -p $PWD/dist/docker
ln -snf $PWD/dist/docker ~/.local/share/cockpit/docker
```

## License 
Cockpit is licensed under the GNU Lesser general public license. 
So im stuck with that. https://github.com/cockpit-project/cockpit/blob/master/COPYING