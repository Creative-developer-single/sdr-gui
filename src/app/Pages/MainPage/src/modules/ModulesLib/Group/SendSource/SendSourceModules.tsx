 export const SendSourceModules = {
  "Modules": [
    {
      "Id":0,
      "Type": "SendSource",
      "Name": "SignalGenerator",
      "Description": "多波形发生器",
      "Properties": {
        "Fixed": {
          "ProcessMode": "block",
          "BlockLength": 1024,
          "InputCount": 1,
          "OutputCount": 1,
          "ComponentID": "Sin1",
          "ComponentType": "Source.SignalGenerator"
        },
        "Global": {
          "SampleRate": 48000,
        },
        "Local": {
          "signalType": "Sine",
          "frequency": 1000,
          "amplitude": 1,
          "blockPhase": 0
        }
      }
    },{
      "Id":0,
      "Type": "SendSource",
      "Name": "RandomGenerator",
      "Description": "随机噪声发生器",
      "Properties": {
        "Fixed": {
          "ProcessMode": "block",
          "BlockLength": 1024,
          "InputCount": 1,
          "OutputCount": 1,
          "ComponentID": "RandomGenerator",
          "ComponentType": "Source.RandomGenerator"
        },
        "Global": {
          "SampleRate": 48000,
        },
        "Local": {
          "NoisePower":1.0,
          "NoiseType":"Real"
        }
      }
    },{
      "Id":0,
      "Type": "SendSource",
      "Name": "RandomNumGenerator",
      "Description": "随机数发生器",
      "Properties": {
        "Fixed": {
          "ProcessMode": "block",
          "BlockLength": 1024,
          "InputCount": 1,
          "OutputCount": 1,
          "ComponentID": "RandomNumGenerator",
          "ComponentType": "Source.RandomNumGenerator"
        },
        "Global": {
          "SampleRate": 48000,
        },
        "Local": {
          "Rb":1000
        }
      }
    }
  ]
}