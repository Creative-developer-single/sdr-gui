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
      },{
        "Id":0,
        "Type": "RF",
        "Name": "VCOComponent",
        "Description": "电压控制振荡器组件",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "VCOComponent",
            "ComponentType": "RF.VCOComponent"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "CenterFrequency": 1000,
            "Sensitivity":100.0,
            "Phase": 0.0
          }
        }
      }
    ]
  }