from fastapi import FastAPI, File, UploadFile
import pandas as pd
from io import BytesIO
app  = FastAPI()
@app.post("/")
async def read_root(file: UploadFile = File(...)):
    print("La función read_root se está ejecutando...")
    contenido = await file.read()
    print("PASE")
    df1 = pd.read_excel(BytesIO(contenido), header=None,  names=["numeros"])
    df2 = pd.read_excel('lista negra contactos.xlsx',  header=None,   names=["numeros"])
    df1['numeros'] = df1['numeros'].astype(str)
    df2['numeros'] = df2['numeros'].astype(str)

    valores_comunes = df1[df1['numeros'].isin(df2['numeros'])]
    diferencia = df1[~df1['numeros'].isin(valores_comunes['numeros'])]
    return {"Diferencia": diferencia, "Length": diferencia.shape[0]}