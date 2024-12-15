import json

def transformar_para_json_server(input_file, output_file):
    """Transforma um arquivo JSON Lines em um formato JSON para json-server."""
    registros = []

    # Lê o arquivo JSON Lines
    with open(input_file, 'r', encoding='utf-8') as infile:
        for index, line in enumerate(infile):
            reg = json.loads(line.strip())
            del reg["_id"]
            reg["id"] = "e" + str(index)
            registros.append(reg)

    # Estrutura no formato esperado pelo json-server
    dados_json_server = {"emds": registros}

    # Escreve no formato JSON único
    with open(output_file, 'w', encoding='utf-8') as outfile:
        json.dump(dados_json_server, outfile, ensure_ascii=False, indent=4)

# Caminhos dos arquivos
input_file = "novos_registos.json"  # Arquivo JSON Lines de entrada
output_file = "db.json"  # Arquivo JSON no formato json-server

# Transformar o arquivo
transformar_para_json_server(input_file, output_file)

print(f"Arquivo transformado e guardado como: {output_file}")
