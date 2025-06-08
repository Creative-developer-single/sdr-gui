export const ShapeFilterModules = {
    "Modules": [
      {
        "Id":0,
        "Type": "ShapeFilter",
        "Name": "RRCFilter",
        "Description": "根升余弦滤波器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "RRCFilter",
            "ComponentType": "ShapeFilter.RRCFilter"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "Rs": 1000,
            "Span": 8,
            "Alpha": 0.5,
            "Mode":"RRC"
          }
        }
      },{
        "Id":0,
        "Type": "ShapeFilter",
        "Name": "RectFilter",
        "Description": "矩形滤波器",
        "Properties": {
          "Fixed": {
            "ProcessMode": "block",
            "BlockLength": 1024,
            "InputCount": 1,
            "OutputCount": 1,
            "ComponentID": "RectFilter",
            "ComponentType": "ShapeFilter.RectFilter"
          },
          "Global": {
            "SampleRate": 48000,
          },
          "Local": {
            "Rs": 1000,
            "Span": 8
          }
        }
      }
    ]
  }