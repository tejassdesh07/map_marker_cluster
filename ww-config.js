export default {
  editor: {
    label: {
      en: "Google Map",
    },
  },
  properties: {
    apiKey: {
      label: {
        en: "Google Maps API Key",
      },
      type: "Text",
      bindable: true,
      required: true,
    },
    zoomLevel: {
      label: {
        en: "Zoom Level",
      },
      type: "Number",
      options: {
        min: 0,
        max: 21,
        step: 1,
      },
      defaultValue: 10,
    },
    centerLat: {
      label: {
        en: "Center Latitude",
      },
      type: "Number",
      defaultValue: 0,
    },
    centerLng: {
      label: {
        en: "Center Longitude",
      },
      type: "Number",
      defaultValue: 0,
    },
    disableUI: {
      label: {
        en: "Disable Default UI",
      },
      type: "Boolean",
      defaultValue: false,
    },
    enableMarkerClustering: {
      label: {
        en: "Enable Marker Clustering",
      },
      type: "Boolean",
      defaultValue: false,
    },
    markerIcon: {
      label: {
        en: "Marker Icon URL",
      },
      type: "Text",
      defaultValue: "",
    },
    tooltipText: {
      label: {
        en: "Tooltip Text",
      },
      type: "Text",
      defaultValue: "",
    },
    markers: {
      label: {
        en: "Markers",
      },
      type: "Array",
      item: {
        type: "Object",
        properties: {
          lat: { label: { en: "Latitude" }, type: "Number", defaultValue: 0 },
          lng: { label: { en: "Longitude" }, type: "Number", defaultValue: 0 },
        },
      },
    },
  },
};
