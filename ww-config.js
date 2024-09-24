export default {
  // Marker icon (on/off)
  // If (prev === 'on') Marker auto size (on/off)
  // If icon URL
  // If (!auto) Icon width (default = 50)
  // If (!auto) Icon height (default = 50)
  // If width or height is not an integer, auto-size will be applied
  options: {
      sizable: true,
  },
  editor: {
      label: {
          fr: 'Map',
          en: 'Map',
      },
      icon: 'map',
      customStylePropertiesOrder: [
          'defaultMapType',
          'mapStyle',
          ['markersIcon', 'defaultMarkerUrl', 'markersAutoSize', 'defaultMarkerWidth', 'defaultMarkerHeight'],
      ],
      customSettingsPropertiesOrder: [
          'googleKey',
          ['lat', 'lng', 'zoom'],
          [
              'markers',
              'hintFields',
              'nameField',
              'latField',
              'lngField',
              'urlField',
              'widthField',
              'heightField',
              'markerTooltipTrigger',
              'fixedBounds',
          ],
          [
              'zoomControl',
              'scaleControl',
              'rotateControl',
              'streetViewControl',
              'fullscreenControl',
              'mapTypeControl',
          ],
      ],
  },
  triggerEvents: [
      {
          name: 'map:click',
          label: { en: 'On map click' },
          event: {
              latLng: {
                  lat: 48.84872727506581,
                  lng: 2.351657694024656,
              },
              domEvent: {},
              pixel: {
                  x: 474,
                  y: 196,
              },
              xb: {
                  x: 129.67228991575087,
                  y: 88.07977939599527,
              },
          },
          default: true,
      },
      {
          name: 'marker:mouseover',
          label: { en: 'On marker mouse enter' },
          event: {
              marker: {
                  content: 'Paris',
                  position: {
                      lat: 48.84872727506581,
                      lng: 2.351657694024656,
                  },
                  rawData: {},
              },
              domEvent: { x: 128, y: 156, target: null },
          },
          getTestEvent: 'getMarkerTestEvent',
      },
      {
          name: 'marker:mouseout',
          label: { en: 'On marker mouse leave' },
          event: {
              marker: {
                  content: 'Paris',
                  position: {
                      lat: 48.84872727506581,
                      lng: 2.351657694024656,
                  },
                  rawData: {},
              },
              domEvent: { x: 128, y: 156, target: null },
          },
          getTestEvent: 'getMarkerTestEvent',
      },
      {
          name: 'marker:click',
          label: { en: 'On marker click' },
          event: {
              marker: {
                  content: 'Paris',
                  position: {
                      lat: 48.84872727506581,
                      lng: 2.351657694024656,
                  },
                  rawData: {},
              },
              domEvent: { x: 128, y: 156, target: null },
          },
          getTestEvent: 'getMarkerTestEvent',
      },
  ],
  properties: {
      defaultMapType: {
          label: {
              en: 'Map type',
              fr: 'Type de map',
          },
          type: 'TextSelect',
          options: {
              options: [
                  { value: 'roadmap', label: 'Standard' },
                  { value: 'satellite', label: 'Satellite' },
                  { value: 'hybrid', label: 'Hybrid' },
                  { value: 'terrain', label: 'Terrain' },
              ],
          },
          defaultValue: 'roadmap',
      },
      mapStyle: {
          hidden: content => content.defaultMapType === 'satellite',
          label: {
              en: 'Map style',
              fr: 'Style de la map',
          },
          type: 'TextSelect',
          options: {
              options: [
                  { value: null, label: 'Standard' },
                  { value: 'silver', label: 'Silver' },
                  { value: 'retro', label: 'Retro' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'night', label: 'Night' },
                  { value: 'aubergine', label: 'Aubergine' },
                  { value: 'custom', label: 'Custom Import' },
              ],
          },
          defaultValue: 'dark',
      },
      markersIcon: {
          label: 'Custom markers',
          type: 'OnOff',
          defaultValue: false,
      },
      markersAutoSize: {
          label: 'Markers auto size',
          type: 'OnOff',
          defaultValue: true,
          hidden: (content, _sidepanelContent, boundProps) => !content.markersIcon,
      },
      defaultMarkerUrl: {
          label: { en: 'Icon' },
          type: 'Image',
          bindable: true,
          options: { nullable: true },
          hidden: (content, _sidepanelContent, boundProps) => !content.markersIcon,
      },
      defaultMarkerWidth: {
          label: 'Width',
          type: 'Number',
          bindable: true,
          options: { min: 0, step: 1, defaultValue: 40 },
          hidden: (content, _sidepanelContent, boundProps) => !content.markersIcon || content.markersAutoSize,
      },
      defaultMarkerHeight: {
          label: 'Height',
          type: 'Number',
          bindable: true,
          options: { min: 0, step: 1, defaultValue: 40 },
          hidden: (content, _sidepanelContent, boundProps) => !content.markersIcon || content.markersAutoSize,
      },
      mapStyleJSON: {
          hidden: content => content.mapStyle !== 'custom' || content.defaultMapType === 'satellite',
          label: {
              en: 'JSON Import',
              fr: 'Import JSON',
          },
          type: 'Script',
      },
      googleKey: {
          section: 'settings',
          label: { en: 'Google key', fr: 'Clé Google' },
          type: 'Text',
          options: {
              placeholder: 'Google API key',
          },
          defaultValue: '',
          bindable: true,
      },
      lat: {
          section: 'settings',
          label: { en: 'Latitude origin', fr: 'Origine - Latitude' },
          type: 'Text',
          options: {
              placeholder: 'Latitude',
          },
          defaultValue: '40.712784',
          bindable: true,
      },
      lng: {
          section: 'settings',
          label: { en: 'Longitude origin', fr: 'Origine - Longitude' },
          type: 'Text',
          options: {
              placeholder: 'Longitude',
          },
          defaultValue: '-74.005941',
          bindable: true,
      },
      zoom: {
          section: 'settings',
          type: 'Number',
          label: { en: 'Zoom', fr: 'Zoom' },
          options: {
              min: 0,
              max: 20,
              step: 1,
          },
          defaultValue: 11,
          bindable: true,
      },
      markers: {
          section: 'settings',
          label: { en: 'Markers', fr: 'Markers' },
          bindable: true,
          type: 'Array',
          options: {
              item: {
                  type: 'Object',
                  defaultValue: { name: '', lat: 0, lng: 0, width: 40, height: 40 },
                  options: {
                      item: {
                          name: {
                              label: { en: 'Name' },
                              type: 'Text',
                              options: { placeholder: 'Value' },
                          },
                          lat: {
                              label: { en: 'Latitude' },
                              type: 'Text',
                              options: { placeholder: 'Latitude' },
                          },
                          lng: {
                              label: { en: 'Longitude' },
                              type: 'Text',
                              options: { placeholder: 'Longitude' },
                          },
                          url: {
                              label: { en: 'Custom marker icon' },
                              type: 'Image',
                              bindable: true,
                              options: { nullable: true },
                              hidden: (content, _sidepanelContent, boundProps) => !content.markersIcon,
                          },
                          width: {
                              label: 'Width',
                              type: 'Number',
                              options: { min: 0, step: 1, defaultValue: 40 },
                              hidden: (content, _sidepanelContent, boundProps) => content.markersAutoSize,
                          },
                          height: {
                              label: 'Height',
                              type: 'Number',
                              options: { min: 0, step: 1, defaultValue: 40 },
                              hidden: (content, _sidepanelContent, boundProps) => content.markersAutoSize,
                          },
                      },
                  },
              },
          },
          defaultValue: [
              { name: 'New York', lat: 40.712784, lng: -74.005941 },
              { name: 'Los Angeles', lat: 34.052234, lng: -118.243685 },
              { name: 'Chicago', lat: 41.878114, lng: -87.629798 },
          ],
      },
      nameField: {
          section: 'settings',
          label: { en: 'Name field', fr: 'Nom' },
          type: 'Text',
          options: { placeholder: 'Name' },
          defaultValue: 'name',
      },
      latField: {
          section: 'settings',
          label: { en: 'Latitude field', fr: 'Latitude' },
          type: 'Text',
          options: { placeholder: 'Latitude' },
          defaultValue: 'lat',
      },
      lngField: {
          section: 'settings',
          label: { en: 'Longitude field', fr: 'Longitude' },
          type: 'Text',
          options: { placeholder: 'Longitude' },
          defaultValue: 'lng',
      },
      widthField: {
          section: 'settings',
          label: { en: 'Marker width', fr: 'Width' },
          type: 'Text',
          options: { placeholder: 'Width' },
          defaultValue: 'width',
          hidden: content => content.markersAutoSize,
      },
      heightField: {
          section: 'settings',
          label: { en: 'Marker height', fr: 'Height' },
          type: 'Text',
          options: { placeholder: 'Height' },
          defaultValue: 'height',
          hidden: content => content.markersAutoSize,
      },
      fixedBounds: {
          section: 'settings',
          label: { en: 'Fixed bounds', fr: 'Limites fixes' },
          type: 'OnOff',
          defaultValue: false,
      },
      hintFields: {
          section: 'settings',
          label: { en: 'Hint fields', fr: 'Champs de tooltip' },
          type: 'Array',
          defaultValue: ['name', 'lat', 'lng'],
      },
      markerTooltipTrigger: {
          section: 'settings',
          label: { en: 'Tooltip trigger', fr: 'Déclencheur tooltip' },
          type: 'TextSelect',
          defaultValue: 'hover',
          options: {
              options: [
                  { value: 'hover', label: { en: 'Hover', fr: 'Survol' } },
                  { value: 'click', label: { en: 'Click', fr: 'Clic' } },
              ],
          },
      },
  },
}
