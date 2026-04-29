from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app) #Permite que o frontend acesse a API, ou seja, o JS acessa o o Python

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="",
        password="", #Lembrar de adicionar a senha do MySQL aqui e o user também, se necessário
        database="todo_list" # O banco que você criou no inicializar_banco
    )

def incializar_banco():
                                                          #Add o user abaixo se necessário, e a senha também
    temp_db = mysql.connector.connect(host="localhost", user="", password="") #Conecta ao MySQL sem especificar o banco de dados

    cursor = temp_db.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS todo_list") #Cria o banco de dados caso ele não exista
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

    return jsonify({'id': novo_id, 
                    "mensagem": "Tarefa adicionada com sucesso!"}), 201

