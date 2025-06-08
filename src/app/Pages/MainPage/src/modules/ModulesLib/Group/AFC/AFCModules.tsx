export const AFCModules = {
    "Modules": [
      {
        "Id":0,
        "Type":"AFC",
        "Name": "AGC",
        "Description": "自动增益控制器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "AGC",
            "ComponentType": "AFC.AGC"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "TargetLevel": 0.5,
            "Step": 0.01,
            "WindowLength": 1024
          }
        }
      }
    ]
  }