export const RFModules = {
    "Modules": [
      {
        "Id":0,
        "Type": "RF",
        "Name": "RPLL",
        "Description": "实数锁相环",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "RPLL",
            "ComponentType": "RF.RPLL"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "CenterFrequency": 1000,
            "DesiredLockedFrequency": 1200
          }
        }
      }
    ]
  }