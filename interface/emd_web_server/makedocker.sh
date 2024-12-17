#!/bin/bash
docker build . --no-cache -t zzglider/emd_web_server
docker push zzglider/emd_web_server:latest
echo 'Terminado'
echo "Id da imagem no DHub: zzglider/emd_web_server:latest"

