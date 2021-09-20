const events = {
  'Red Flag Warning': {
    'folder': 'rfw',
    'color': 'e60000',
    'message': '🚩 New Red Flag Warning 🚩 \n\nA Red Flag Warning has been issued for these areas. Weather events which may result in extreme fire behavior will occur within 24 hours. This is the highest alert. Please use extreme caution.',
    'alt_message': '🚩 Cleared: Red Flag Warning 🚩 \n\nThere are currently no Red Flag Warnings.'
  },
  'Fire Weather Watch': {
    'folder': 'fww',
    'color': 'ff6d05',
    'message': '🏳 New Fire Weather Watch Alert 🏳 \n\nA Fire Weather Watch has been issued for these areas. Weather events which may result in extreme fire behavior could exist in the next 12-72 hours.',
    'alt_message': '🏳 Cleared: Fire Weather Watch Alert 🏳 \n\nThere are currently no areas under a Fire Weather Watch Alert.'
  },
  'Severe Thunderstorm Watch': {
    'folder': 'stw',
    'color': '808c9e',
    'message': '⛈ New Severe Thunderstorm Watch ⛈ \n\nConditions are favorable for the development of severe thunderstorms in and close to the watch area.',
    'alt_message': '⛈ Cleared: Severe Thunderstorm Watch ⛈ \n\nThere are currently no areas under advisement for Severe Thunderstorm Watch.'
  },
  'Severe Thunderstorm Warning': {
    'folder': 'stwarning',
    'color': '808c9e',
    'message': '⛈ New Severe Thunderstorm Warning ⛈ \n\nA thunderstorm producing hail one inch or larger in diameter and/or winds equal or exceed 58 miles an hour has been reported. People in the affected area should seek safe shelter immediately.',
    'alt_message': '⛈ Cleared: Severe Thunderstorm Warning ⛈ \n\nThere are currently no areas under advisement for Severe Thunderstorm Warning.'
  },
  'Flash Flood Watch': {
    'folder': 'ffw',
    'color': '00008a',
    'message': '🌊 New Flash Flood Watch 🌊 \n\nConditions exist or are developing that that are favorable for flash flooding in and close to the watch area.',
    'alt_message': '🌊 Cleared: Flash Flood Watch 🌊 \n\nThere are currently no areas under advisement for Flash Flooding.'
  },
  'Flash Flood Warning': {
    'folder': 'ffwarning',
    'color': '00008a',
    'message': '🌊 New Flash Flood Warning 🌊 \n\nFlash flooding is in progress, imminent, or highly likely. Please seek shelter.',
    'alt_message': '🌊 Cleared: Flash Flood Warning 🌊 \n\nThere are currently no areas under advisement for Flash Flooding.'
  },
  'Hurricane Watch': {
    'folder': 'hw',
    'color': '00ceed',
    'message': '🌀 New Hurricane Watch 🌀 \n\nA tropical cyclone containing winds of at least 74 MPH poses a possible threat, generally within 48 hours. A watch does not mean hurricane conditions will occur, only that these conditions are possible.',
    'alt_message': '🌀 Cleared: Hurricane Watch 🌀 \n\nThere are currently no areas under advisement for Hurricane Watch.'
  },
  'Hurricane Warning': {
    'folder': 'hwarning',
    'color': '00ceed',
    'message': '🌀 New Hurricane Warning 🌀 \n\nHurricane conditions (sustained winds of 74 mph+) are expected in this area. This warning is usually issued 36 hours in advance of tropical storm-force winds to give you time to complete your preparations. Evacuate immediately if so ordered.',
    'alt_message': '🌀 Cleared: Hurricane Warning 🌀 \n\nThere are currently no areas under advisement for Hurricane Warning.'
  }
};

export { events };