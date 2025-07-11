export const ReceiveSourceModules = {
    "GroupName": "receiveSource",
    "Modules": [
      {
        "Id":0,
        "Type": "ReceiveSource",
        "Name": "randomReceiver",
        "Description": "随机信号接收器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "test0",
            "ComponentType": "test.testModule"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "mode": "test"
          }
        }
      }
    ]
  }