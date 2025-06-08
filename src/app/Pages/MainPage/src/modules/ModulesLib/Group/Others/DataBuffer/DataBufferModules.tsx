export const DataBufferModules = {
    "Modules": [
      {
        "Id":0,
        "Type": "Others",
        "Name": "SinglePortBuffer",
        "Description": "单端口数据缓冲区",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "Buffer1",
            "ComponentType": "Others.DataBuffer.SinglePortBuffer"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "bufferLength": 4096,
          }
        }
      }
    ]
  }