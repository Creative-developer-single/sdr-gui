export const FIRModules = {
    "Modules": [
      {
        "Id":0,
        "Type": "FIR",
        "Name": "FIRLowPass",
        "Description": "FIR低通滤波器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "FIRLowPass",
            "ComponentType": "FIR.FIRLowPass"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "CutOffFrequency": 1000,
            "WindowLength": 64,
            "WindowType":"Hamming"
          }
        }
      },{
        "Id":0,
        "Type": "FIR",
        "Name": "FIRHighPass",
        "Description": "FIR高通滤波器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "FIRHighPass",
            "ComponentType": "FIR.FIRHighPass"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "CutOffFrequency": 1000,
            "WindowLength": 64,
            "WindowType":"Hamming"
          }
        }
      },{
        "Id":0,
        "Type": "FIR",
        "Name": "FIRBandPass",
        "Description": "FIR带通滤波器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "FIRBandPass",
            "ComponentType": "FIR.FIRBandPass"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "LowCutOffFrequency": 1000,
            "HighCutOffFrequency": 2000,
            "WindowLength": 64,
            "WindowType":"Hamming"
          }
        }
      },{
        "Id":0,
        "Type": "FIR",
        "Name": "FIRBandStop",
        "Description": "FIR带阻滤波器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "FIRBandStop",
            "ComponentType": "FIR.FIRBandStop"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "LowCutOffFrequency": 1000,
            "HighCutOffFrequency": 2000,
            "WindowLength": 64,
            "WindowType":"Hamming"
          }
        }
      }
    ]
  }