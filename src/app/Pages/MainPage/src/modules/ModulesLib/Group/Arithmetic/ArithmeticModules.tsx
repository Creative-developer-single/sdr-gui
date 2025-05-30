export const ArithmeticModules = {
    "Modules": [
      {
        "Name": "basicALU",
        "Description": "基础运算器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 2,
            "OutputCount": 1,
            "ComponentID": "default0",
            "ComponentType": "Arthmetic.basicALU"
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
        "Name": "Calculus",
        "Description": "微积分器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "default0",
            "ComponentType": "Arthmetic.Calculus"
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
        "Name": "NonLinear",
        "Description": "非线性运算器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 2,
            "OutputCount": 1,
            "ComponentID": "default0",
            "ComponentType": "Arthmetic.NonLinear"
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