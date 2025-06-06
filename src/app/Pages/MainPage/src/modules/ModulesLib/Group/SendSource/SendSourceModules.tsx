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
          "ComponentID": "Sin1",
          "signalType": "Sine",
          "frequency": 1000,
          "amplitude": 1,
          "blockPhase": 0
        }
      }
    }
  ]
}