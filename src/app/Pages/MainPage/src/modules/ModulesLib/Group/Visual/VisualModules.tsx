export const VisualModules = {
    "Modules": [
      {
        "Id":0,
        "Type": "Visual",
        "Name": "Oscilloscope",
        "Description": "示波器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "Sin1",
            "ComponentType": "Visual.Oscilloscope"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "bufferLength": 512,
            "DataType":"Real"
          }
        }
      }
    ]
  }