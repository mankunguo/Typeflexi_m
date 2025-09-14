export const SET_FONT_SIZE_VALUE = 'SET_FONT_SIZE_VALUE';
export const SET_SPACE_VALUE = 'SET_SPACE_VALUE';
export const SET_LINE_VALUE = 'SET_LINE_VALUE';
export const SET_COLOR_VALUE = 'SET_COLOR_VALUE';
export const SET_ALIGN_VALUE = 'SET_ALIGN_VALUE';
export const SET_MIDDLE_VALUE = 'SET_MIDDLE_VALUE';
export const SET_IS_GRID_ACTIVE = 'SET_IS_GRID_ACTIVE';
export const SET_IS_DOM_TYPE_ACTIVE = 'SET_IS_DOM_TYPE_ACTIVE';
export const SET_UPLOAD_FLAG = 'SET_UPLOAD_FLAG';
export const SET_BROWSE_ARCHIVE_FLAG = 'SET_BROWSE_ARCHIVE_FLAG'
export const SET_PATH_02 = 'SET_PATH_02';
export const SET_PATH_12 = 'SET_PATH_12';
export const SET_PATH_03 = 'SET_PATH_03';
export const SET_PATH_13 = 'SET_PATH_13';
export const SET_PATH_04 = 'SET_PATH_04';
export const SET_PATH_14 = 'SET_PATH_14';
export const SET_PATH_05 = 'SET_PATH_05';
export const SET_PATH_15 = 'SET_PATH_15';
export const SET_CORNER_11 = 'SET_CORNER_11';
export const SET_CORNER_31 = 'SET_CORNER_31';
export const SET_LINES = 'SET_LINES';


export const setFontSizeValue = (value) => {
  return {
    type: SET_FONT_SIZE_VALUE,
    payload: value,
  };
};

export const setSpaceValue = (value) => {
  return {
    type: SET_SPACE_VALUE,
    payload: value,
  };
};

export const setLineValue = (value) => {
  return {
    type: SET_LINE_VALUE,
    payload: value,
  };
};

export const setColorValue = (value) => {
  return {
    type: SET_COLOR_VALUE,
    payload: value,
  };
};

export const setAlignValue = (value) => {
  return {
    type: SET_ALIGN_VALUE,
    payload: value,
  };
};

export const setMiddleValue = (value) => {
  return {
    type: SET_MIDDLE_VALUE,
    payload: value,
  };
};

export const setIsGridActive = (value) => {
  return {
    type: SET_IS_GRID_ACTIVE,
    payload: value,
  };
};

export const setIsDomTypeActive = (value) => {
  return {
    type: SET_IS_DOM_TYPE_ACTIVE,
    payload: value,
  };
};

export const setUploadFlag = (value) => {
  return {
    type: SET_UPLOAD_FLAG,
    payload: value,
  };
};
export const setBrowseArchiveFlag = (value) => {
  return {
    type: SET_BROWSE_ARCHIVE_FLAG,
    payload: value,
  };
};


export const setPath02 = (value) => ({
  type: SET_PATH_02,
  payload: value,
});

export const setPath12 = (value) => ({
  type: SET_PATH_12,
  payload: value,
});

export const setPath03 = (value) => ({
  type: SET_PATH_03,
  payload: value,
});

export const setPath13 = (value) => ({
  type: SET_PATH_13,
  payload: value,
});

export const setPath04 = (value) => ({
  type: SET_PATH_04,
  payload: value,
});

export const setPath14 = (value) => ({
  type: SET_PATH_14,
  payload: value,
});

export const setPath05 = (value) => ({
  type: SET_PATH_05,
  payload: value,
});

export const setPath15 = (value) => ({
  type: SET_PATH_15,
  payload: value,
});

export const setCorner11 = (value) => ({
  type: SET_CORNER_11,
  payload: value,
});

export const setCorner31 = (value) => ({
  type: SET_CORNER_31,
  payload: value,
});

export const setLines = (value) => ({
  type: SET_LINES,
  payload: value,
});