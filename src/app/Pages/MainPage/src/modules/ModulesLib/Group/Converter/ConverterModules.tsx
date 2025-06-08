export const ConverterModules = {
    "Modules": [
      {
        "Id":0,
        "Type": "Converter",
        "Name": "DataConverter",
        "Description": "数据转换器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "Converter",
            "ComponentType": "Converter.DataConverter"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "ConvertType":"Real"
          }
        }
      },{
        "Id":0,
        "Type": "Converter",
        "Name": "DataAllocator",
        "Description": "数据分配器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 2,
            "ComponentID": "DataAllocator",
            "ComponentType": "Converter.DataAllocator"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            
          }
        }
      },{
        "Id":0,
        "Type": "Converter",
        "Name": "DataCombiner",
        "Description": "数据合并器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 2,
            "OutputCount": 1,
            "ComponentID": "DataCombiner",
            "ComponentType": "Converter.DataCombiner"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            
          }
        }
      }
    ]
  }