 export const SendSourceModules = {
  "Modules": [
    {
      "Name": "testModule",
      "Description": "这是一个测试模块",
      "Properties": {
        "Fixed": {
          "ProcessMode": "block",
          "BlockLength": 512,
          "InputCount": 1,
          "OutputCount": 1,
          "ComponentType": "test.testModule"
        },
        "Global": {
          "SampleRate": 48000
        },
        "Local": {
          "ComponentID": "test0",
          "mode": "test"
        }
      }
    }
  ]
}