export const DeModulationModules = {
    "Modules": [
      {
        "Id":0,
        "Type":"DeModulation",
        "Name": "AMDemodulator",
        "Description": "调幅解调器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "AMDemodulator",
            "ComponentType": "DeModulation.AMDemodulator"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "CarrierFrequency": 1000,
            "CutoffFrequency": 500
          }
        }
      },{
        "Id":0,
        "Type":"DeModulation",
        "Name": "DSBDeModulator",
        "Description": "调幅解调器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "DSBDeModulator",
            "ComponentType": "DeModulation.DSBDeModulator"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "LpfCutOffFrequency": 500,
            "LpfWindowLength": 64,
            "LpfWindowType": "Hamming"
          }
        }
      }
    ]
  }