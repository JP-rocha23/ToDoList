from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app) #Permite que o frontend acesse a API, ou seja, o JS acessa o o Python

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="jp2004", #Lembrar de adicionar a senha do MySQL aqui e o user também, se necessário
        database="todo_list" # O banco que você criou no inicializar_banco
    )

def incializar_banco():
                                                          
    temp_db = mysql.connector.connect(host="localhost", user="root", password="jp2004") #Conecta ao MySQL sem especificar o banco de dados

    cursor = temp_db.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS todo_list") 
    temp_db.close()

    conector = get_db_connection()
    cursor = conector.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tarefas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL,
        concluido BOOLEAN NOT NULL DEFAULT FALSE,
        prioridade VARCHAR(50) NOT NULL)
        """)

    conector.commit()
    cursor.close()
    conector.close()

incializar_banco()

@app.route('/tarefas', methods=['POST']) #Define a rota para criar uma nova tarefa

def adicionar_tarefa():
    dados = request.get_json() #Pega o JSON enviado pelo Js

    descricao = dados.get('descricao')
    concluido = dados.get('concluido', False) 
    prioridade = dados.get('prioridade', 'Normal')

    conector = get_db_connection()
    cursor = conector.cursor()

    query = "INSERT INTO tarefas (descricao, concluido, prioridade) VALUES (%s, %s, %s)"
    cursor.execute(query, (descricao, concluido, prioridade))

    novo_id = cursor.lastrowid #Pega o ID da tarefa recém criada -> para retornar para o frontend

    conector.commit()
    cursor.close()
    conector.close()

    return jsonify({
    "id": novo_id,
    "descricao": descricao,
    "concluido": concluido,
    "prioridade": prioridade
    }), 201

@app.route('/tarefas', methods=['GET'])
def listar_tarefas(): #Rota para listar todas as tarefas, o JS vai chamar essa rota para mostrar as tarefas na tela quando recarregar a página
    conector = get_db_connection()
    cursor = conector.cursor(dictionary=True) 
    cursor.execute("SELECT * FROM tarefas")
    lista_tarefas = cursor.fetchall()
    cursor.close()
    conector.close()
    return jsonify(lista_tarefas)

@app.route('/tarefas/<int:tarefa_id>', methods=['DELETE'])
def deletar_tarefa(tarefa_id):
    conector = get_db_connection()
    cursor = conector.cursor()

    query = "DELETE FROM tarefas WHERE id = %s"
    cursor.execute(query, (tarefa_id,))

    conector.commit()
    cursor.close()
    conector.close()

    return jsonify({"message": "Tarefa deletada com sucesso!"}), 200

@app.route('/tarefas/<int:tarefa_id>', methods=['PUT'])
def dar_check_tarefa(tarefa_id):
    dados = request.get_json()
    concluido = dados.get('concluido')

    conector = get_db_connection()
    cursor = conector.cursor()

    query = "UPDATE tarefas SET concluido = %s WHERE id = %s"
    cursor.execute(query, (concluido, tarefa_id))

    conector.commit()
    cursor.close()
    conector.close()

    return jsonify({"message": "Tarefa atualizada com sucesso!"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
