export const ArithmeticModules = {
    "Modules": [
      {
        "Id":0,
        "Type":"Arithmetic",
        "Name": "BasicALU",
        "Description": "基础运算器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 2,
            "OutputCount": 1,
            "ComponentID": "default0",
            "ComponentType": "Arithmetic.BasicALU"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "OperationMode": "Add"
          }
        }
      },
      {
        "Id":0,
        "Type":"Arithmetic",
        "Name": "Calculus",
        "Description": "微积分器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "default0",
            "ComponentType": "Arithmetic.Calculus"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "OperationMode": "Integral"
          }
        }
      },
      {
        "Id":0,
        "Type":"Arithmetic",
        "Name": "NonLinear",
        "Description": "非线性运算器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 2,
            "OutputCount": 1,
            "ComponentID": "default0",
            "ComponentType": "Arithmetic.NonLinear"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "OperationMode": "abs"
          }
        }
      }
    ]
  }