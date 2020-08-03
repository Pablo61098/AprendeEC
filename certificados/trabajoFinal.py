

def impar(numero):
    if(numero%2 == 0 or numero <= 1):
        return False
    else:
        return True

def revisar_elementos(elementos, cantidad):
    # print(elementos)
    # print(cantidad)
    if(len(elementos) != cantidad):
        return False

    for i in elementos:
        # print(float(i))
        if(not float(i).is_integer()):
            return False
    
    # print(True)
    return True

def insertar_matriz(elementos, n):
    fila=[]
    matriz = []
    # print(elementos)
    j=0
    for i in range(len(elementos)):
        if(j == n ):
            matriz.insert(0, fila)
            fila = []
            j=0
        j += 1
        fila.insert(0, int(float(elementos[i])))
    
    matriz.insert(0, fila)
    return matriz

def imprimir_matriz(matriz):
    # j=0
    # for i in range(len(elementos)):
    #     if(j == n):
    #         print("\n")
    #     else:
    #         print(elementos[i], end=" ")
    #         j = 0
    #     j += 1
    for i in range(len(matriz)):
        for j in range(len(matriz[i])):
            print('{:5d}'.format(matriz[i][j]), end= " ")
        print("\n")


def espiral_reemplazar(matriz, medio, divisores):
    i = 1
    col = medio
    row = medio
    elemento_medio = matriz[medio][medio]
    flag = False
    count_divisores = 0  
    while(True):
        if(i%2 == 1):
            for j in range(1,i+1):
                # print("L: " + str(row) + "*" + str(col-j))
                if(col-j <0):
                    flag = True
                    break
                try:
                    if(elemento_medio % matriz[row][col-j] == 0):
                        matriz[row][col-j] = int(elemento_medio / matriz[row][col-j])
                except:
                    pass
                # print(", " + str(matriz[row][col-j]), end="")                
            if(flag):
                break
            col = col - j
            for j in range(1,i+1):
                # print("D: " + str(row+j) + "*" + str(col))
                try:
                    if(elemento_medio % matriz[row+j][col] == 0):
                        matriz[row+j][col] = int(elemento_medio / matriz[row+j][col])
                except:
                    pass
                # print(", " + str(matriz[row+j][col]), end="")
                
            row = row + j
        else:
            for j in range(1,i+1):
                # print("R: " + str(row) + "*" + str(col+j))
                try:
                    if(elemento_medio % matriz[row][col+j] == 0):
                        matriz[row][col+j] = int(elemento_medio / matriz[row][col+j])
                except:
                    pass
                # print(", " + str(matriz[row][col+j]), end="")
                
            col = col + j
            for j in range(1,i+1):
                # print("U: " + str(row-j) + "*" + str(col))
                try:
                    if(elemento_medio % matriz[row-j][col] == 0):
                        matriz[row-j][col] = int(elemento_medio / matriz[row-j][col])
                except:
                    pass
                # print(", " + str(matriz[row-j][col]), end=" ")
                
            row = row - j
        if(i==len(matriz)):
            break
        
        i = i+1

    return matriz

def espiral(matriz, medio):
    i = 1
    col = medio
    row = medio
    elemento_medio = matriz[medio][medio]
    print(matriz[medio][medio], end="")
    flag = False
    divisores = []
    while(True):
        if(i%2 == 1):
            for j in range(1,i+1):
                # print("L: " + str(row) + "*" + str(col-j))
                if(col-j <0):
                    flag = True
                    break
                print(", " + str(matriz[row][col-j]), end="")
                try:
                    if(elemento_medio % matriz[row][col-j] == 0 ):
                        divisores.append(str(matriz[row][col-j]))
                except:
                    pass
            if(flag):
                break
            col = col - j
            for j in range(1,i+1):
                # print("D: " + str(row+j) + "*" + str(col))
                print(", " + str(matriz[row+j][col]), end="")
                try:
                    if(elemento_medio % matriz[row+j][col] == 0 ):
                        divisores.append(str(matriz[row+j][col]))
                except:
                    pass
            row = row + j
        else:
            for j in range(1,i+1):
                # print("R: " + str(row) + "*" + str(col+j))
                print(", " + str(matriz[row][col+j]), end="")
                try:
                    if(elemento_medio % matriz[row][col+j] == 0 ):
                        divisores.append(str(matriz[row][col+j]))
                except:
                    pass
            col = col + j
            for j in range(1,i+1):
                # print("U: " + str(row-j) + "*" + str(col))
                print(", " + str(matriz[row-j][col]), end=" ")
                try:
                    if(elemento_medio % matriz[row-j][col] == 0 ):
                        divisores.append(str(matriz[row-j][col]))
                except:
                    pass
            row = row - j
        if(i==len(matriz)):
            break
        
        i = i+1

    return divisores 

def encontrar_central(matriz, numero):
    medio = int((numero -1)/2)
    return matriz[medio][medio]

if __name__ == "__main__":

    print("\n------------- Proyecto Final --------------")
    numero = int(input("Ingrese el tamaño de la matriz (impar): "))
    while(not impar(numero)):
        numero = int(input("Ingrese correctamente el tamaño de la matriz (impar): "))
    
    elementos = input("\nIngrese los " + str(numero**2) + " valores de la matriz en una linea separados por la coma: ")
    # elementos = "13,64,6,12,11,80,45,21,3,18,12,16,21,0,1.3,2,15,10,9,6,8,7,6,5,4"
    elementos = elementos.split(",")
    
    while(not revisar_elementos(elementos, numero**2)):
        elementos = input("\nIngrese los " + str(numero**2) + " valores de la matriz (CORRECTAMENTE) en una linea separados por la coma: ")
        # elementos = "13,64,6,12,11,80,45,21,3,18,12,16,21,0,1.0,2,15,10,9,6,8,7,6,5,4"
        elementos = elementos.split(",")
    
    matriz = insertar_matriz(elementos, numero)
    medio =  int((numero -1)/2)
    # print(matriz)
    print("\nMatriz: \n")
    imprimir_matriz(matriz)
    print("\nEl numero central de la matriz es el: \n")
    central = encontrar_central(matriz, numero)
    print("\t" + str(central) + "\n")
    print("\nLa lectura de los numeros en espiral es la siguiente: \n")
    divisores = espiral(matriz, medio)
    print("\n\nLos divisores que se encuentran en la matriz son los siguientes: \n")
    print(",".join(divisores))
    matriz = espiral_reemplazar(matriz, medio, divisores)
    print("\nMatriz Reemplazada: \n")
    imprimir_matriz(matriz)
