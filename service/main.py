# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify, send_file
import base64
import os
import io
import pybase64
import re
import zipfile
from PIL import Image

app = Flask(__name__)
basePath = '/home/ubuntu/font-dev/service/'

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route('/upload', methods=['POST'])
def upload():
    dataArr = request.get_json()
   
    for data in dataArr:
      path = os.path.join(basePath, data['path'] )
      base64_string =  data['base64']
      filename = data['filename']
      if(filename == "?"):
        filename = "问号.png"
      elif(filename == "."):
        filename = "点.png"
      elif(filename == ":"):
        filename = "冒号.png"
      elif(filename == " "):
        filename = "空格.png"
      elif(filename == "10"):
        filename = "0.png"
      else:
        print("filename   "+filename)
        filename =  filename +".png"



      print("filename++++"+filename)
      special_chars = re.findall(r'[^\w\s]', filename)
      if special_chars:
        save_path =  os.path.join(path, filename)

      else:
        save_path = os.path.join(path, "aaa.png")


      # 处理中文乱码
      save_path = save_path.encode('utf-8').decode('utf-8')

      # 解码Base64字符串为二进制数据
      decoded_data = pybase64.b64decode(base64_string)

      # 将二进制数据转换为Image对象
      image = Image.open(io.BytesIO(decoded_data))

      # 检查目录是否存在
      if not os.path.exists(path):
          # 创建新目录
          os.makedirs(path)
      print(save_path)
    
      # 保存图像到指定路径
      image.save(save_path)

    return jsonify({"message": "success"})


@app.route("/list", methods=['POST'])
def list_files():
    directory = basePath
    names = []
    for root, dirs, files in os.walk(directory):
        for dir_name in dirs:
            names.append(dir_name)
    return jsonify(names)

@app.route("/getImages", methods=['POST'])
def get_images():
    path= request.get_json()


    # 根据传递的路径获取相关图片的绝对路径
    image_paths = get_image_paths( os.path.join(basePath, path))

    if not image_paths:
        return "No images found for the specified path", 404

    zip_data = io.BytesIO()
    with zipfile.ZipFile(zip_data, "w") as zf:
        for image_path in image_paths:
            arcname = os.path.basename(image_path)  # 使用图片文件名作为ZIP中的文件名
            zf.write(image_path, arcname=arcname)

    zip_data.seek(0)
    return send_file(zip_data, mimetype='application/zip', as_attachment=True,download_name='images.zip')

def get_image_paths(path):
    # 根据路径获取相关图片的绝对路径
    # 这里需要你实现根据路径获取相关图片的逻辑
    # 返回一个包含图片路径的列表
    # 示例代码假设 path 是一个目录，其中包含了需要的图片文件
    if not os.path.isdir(path):
        return []
    
    image_paths = []
    for file_name in os.listdir(path):
        if file_name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            image_path = os.path.join(path, file_name)
            image_paths.append(image_path)
    
    return image_paths

@app.route("/download")
def download_folder():
    data = request.get_json()
    path = data['path'] 
    folder_path = "/path/to/folder"  # 要打包的文件夹路径
    zip_filename = path + ".zip"  # 压缩文件名

    # 创建一个临时文件夹用于存放打包的文件
    temp_folder = "/path/to/temp"
    os.makedirs(temp_folder, exist_ok=True)

    # 将文件夹打包为zip文件
    zip_path = os.path.join(temp_folder, zip_filename)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, folder_path))

    # 返回打包的zip文件给前端
    # return send_file(zip_path, as_attachment=True, attachment_filename=zip_filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0')