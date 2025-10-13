export const ModulationModules = {
    "Modules": [
      {
        "Id":0,
        "Type":"Modulation",
        "Name": "AMModulator",
        "Description": "AM调制器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "AMModulator",
            "ComponentType": "Modulation.AMModulator"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "CarrierFrequency": 1000,
            "ModulationIndex": 0.5
          }
        }
      },{
        "Id":0,
        "Type":"Modulation",
        "Name": "DSBSCModulator",
        "Description": "DSBSC调制器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "DSBSCModulator",
            "ComponentType": "Modulation.DSBSCModulator"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "CarrierFrequency": 1000,
            "PilotPower": 0.5
          }
        }
      },{
        "Id":0,
        "Type":"Modulation",
        "Name": "FMModulator",
        "Description": "FM调制器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "FMModulator",
            "ComponentType": "Modulation.FMModulator"
          },
          "Global": {
            "SampleRate": 48000
          },
          "Local": {
            "CarrierFrequency": 1000,
            "FMModulationParams": 1
          }
        }
      }
    ]
  }