import {
  combineReducers
} from 'redux';
import {
  SET_FONT_SIZE_VALUE,
  SET_SPACE_VALUE,
  SET_LINE_VALUE,
  SET_COLOR_VALUE,
  SET_ALIGN_VALUE,
  SET_MIDDLE_VALUE,
  SET_IS_GRID_ACTIVE,
  SET_IS_DOM_TYPE_ACTIVE,
  SET_UPLOAD_FLAG,
  SET_BROWSE_ARCHIVE_FLAG,
  SET_PATH_02,
  SET_PATH_12,
  SET_PATH_03,
  SET_PATH_13,
  SET_PATH_04,
  SET_PATH_14,
  SET_PATH_05,
  SET_PATH_15,
  SET_CORNER_11,
  SET_CORNER_31,
  SET_LINES,
} from '../actions';

const fontSizeValueReducer = (state = 1, action) => {
  switch (action.type) {
    case SET_FONT_SIZE_VALUE:
      return action.payload;
    default:
      return state;
  }
};

const spaceValueReducer = (state = 20, action) => {
  switch (action.type) {
    case SET_SPACE_VALUE:
      return action.payload;
    default:
      return state;
  }
};

const lineValueReducer = (state = 20, action) => {
  switch (action.type) {
    case SET_LINE_VALUE:
      return action.payload;
    default:
      return state;
  }
};

const colorValueReducer = (state = 'black', action) => {
  switch (action.type) {
    case SET_COLOR_VALUE:
      return action.payload;
    default:
      return state;
  }
};

const alignValueReducer = (state = 'left', action) => {
  switch (action.type) {
    case SET_ALIGN_VALUE:
      return action.payload;
    default:
      return state;
  }
};

const middleValueReducer = (state = true, action) => {
  switch (action.type) {
    case SET_MIDDLE_VALUE:
      return action.payload;
    default:
      return state;
  }
};

const isGridActiveReducer = (state = true, action) => {
  switch (action.type) {
    case SET_IS_GRID_ACTIVE:
      return action.payload;
    default:
      return state;
  }
};

const isDomTypeActiveReducer = (state = true, action) => {
  switch (action.type) {
    case SET_IS_DOM_TYPE_ACTIVE:
      return action.payload;
    default:
      return state;
  }
};

const uploadFlagReducer = (state = false, action) => {
  if (action.type === SET_UPLOAD_FLAG) {
    return action.payload;
  }
  return state;

};


const browseArchiveFlagReducer = (state = false, action) => {
  switch (action.type) {
    case SET_BROWSE_ARCHIVE_FLAG:
      return action.payload;
    default:
      return state;
  }
};

const path02Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_PATH_02:
      return action.payload;
    default:
      return state;
  }
};

const path12Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_PATH_12:
      return action.payload;
    default:
      return state;
  }
};

const path03Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_PATH_03:
      return action.payload;
    default:
      return state;
  }
};

const path13Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_PATH_13:
      return action.payload;
    default:
      return state;
  }
};

const path04Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_PATH_04:
      return action.payload;
    default:
      return state;
  }
};

const path14Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_PATH_14:
      return action.payload;
    default:
      return state;
  }
};

const path05Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_PATH_05:
      return action.payload;
    default:
      return state;
  }
};

const path15Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_PATH_15:
      return action.payload;
    default:
      return state;
  }
};

const corner11Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_CORNER_11:
      return action.payload;
    default:
      return state;
  }
};

const corner31Reducer = (state = null, action) => {
  switch (action.type) {
    case SET_CORNER_31:
      return action.payload;
    default:
      return state;
  }
};

const linesReducer = (state = [
  { x1: 68, y1: 0, x2: 68, y2: 340 }, // 横1
  { x1: 137, y1: 0, x2: 137, y2: 340 }, // 横2
  { x1: 0, y1: 68, x2: 205, y2: 68 }, // 竖1
  { x1: 0, y1: 137, x2: 205, y2: 137 }, // 竖2
  { x1: 0, y1: 204, x2: 205, y2: 204 }, // 竖3
  { x1: 0, y1: 272, x2: 205, y2: 272 }, // 竖4
], action) => {
  switch (action.type) {
    case SET_LINES:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  fontSizeValue: fontSizeValueReducer,
  spaceValue: spaceValueReducer,
  lineValue: lineValueReducer,
  colorValue: colorValueReducer,
  alignValue: alignValueReducer,
  middleValue: middleValueReducer,
  isGridActive: isGridActiveReducer,
  isDomTypeActive: isDomTypeActiveReducer,
  uploadFlag: uploadFlagReducer,
  browseArchiveFlag: browseArchiveFlagReducer,
  path02: path02Reducer,
  path12: path12Reducer,
  path03: path03Reducer,
  path13: path13Reducer,
  path04: path04Reducer,
  path14: path14Reducer,
  path05: path05Reducer,
  path15: path15Reducer,
  corner11: corner11Reducer,
  corner31: corner31Reducer,
  lines: linesReducer,

});
export default rootReducer;