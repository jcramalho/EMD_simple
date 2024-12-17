#!/bin/bash
docker build . --no-cache -t zzglider/emd_data_server
docker push zzglider/emd_data_server:latest
echo 'Terminado'
echo "Id da imagem no DHub: zzglider/emd_data_server:latest"

