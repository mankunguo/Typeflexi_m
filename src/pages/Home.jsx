
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFontSizeValue, setSpaceValue, setLineValue, setColorValue, setAlignValue, setMiddleValue, setIsGridActive, setUploadFlag, setBrowseArchiveFlag } from '../actions';
import JSZip from 'jszip';
import './Home.scss'
import { Slider, message, Button, Spin } from 'antd';
import iconAlignCenterActive from '../assets/icon-align-center-active.png';
import iconAlignCenter from '../assets/icon-align-center.png';
import iconAlignLeftActive from '../assets/icon-align-left-active.png';
import iconAlignLeft from '../assets/icon-align-left.png';
import iconAlignMiddleActive from '../assets/icon-align-middle-active.png';
import iconAlignMiddle from '../assets/icon-align-middle.png';
import iconAlignRightActive from '../assets/icon-align-right-active.png';
import iconAlignRight from '../assets/icon-align-right.png';
import iconBack from '../assets/icon-back.png';

var canvas, canvasHide, canvasTemp;
var ctx, ctxHide, ctxTemp;


const Home = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const canvasHideRef = useRef(null);
  const targetRef = useRef(null);
  const canvasTempRef = useRef(null);
  const defaultCanvasBounding = { width: 205, height: 341 };
  const getDefaultLines = () => ([
    { x1: 68, y1: 0, x2: 68, y2: 340 }, // 横1
    { x1: 137, y1: 0, x2: 137, y2: 340 }, // 横2
    { x1: 0, y1: 68, x2: 205, y2: 68 }, // 竖1
    { x1: 0, y1: 137, x2: 205, y2: 137 }, // 竖2
    { x1: 0, y1: 204, x2: 205, y2: 204 }, // 竖3
    { x1: 0, y1: 272, x2: 205, y2: 272 }, // 竖4
  ]);

  var canvasBounding = JSON.parse(localStorage.getItem('canvasBounding')) || defaultCanvasBounding;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontLoading, setFontLoading] = useState(false);
  const browseArchiveFlag = useSelector(state => state.browseArchiveFlag);
  const fontSizeValue = useSelector(state => state.fontSizeValue);
  const spaceValue = useSelector(state => state.spaceValue);
  const lineValue = useSelector(state => state.lineValue);
  const colorValue = useSelector(state => state.colorValue);
  const alignValue = useSelector(state => state.alignValue);
  const middleValue = useSelector(state => state.middleValue);
  const isGridActive = useSelector(state => state.isGridActive);
  // const isDomTypeActive = useSelector(state => state.isDomTypeActive);

  const [isDomTypeActive, setIsDomTypeActive]  = useState(true);

  var uploadFlagGlobe = false
  var base64dataArr = []
  // var cloneLine = []
  // const { path02, path12, path03, path13, path04, path14, path05, path15, corner11, corner31 } = useSelector(state => state);

  //const [fontSizeValue, setFontSizeValue] = useState(1);
  // const [spaceValue, setSpaceValue] = useState(20)
  // const [lineValue, setLineValue] = useState(20)
  // const [colorValue, setColorValue] = useState("black")
  // const [alignValue, setAlignValue] = useState("left")
  // const [middleValue, setMiddleValue] = useState(true)
  // const [isGridActive, setIsGridActive] = useState(true);
  // const [isDomTypeActive, setIsDomTypeActive] = useState(true);


  var globeId = generateId()

  var path02, path12, path03, path13, path04, path14, path05, path15, corner11, corner31




  var selectedLineIndex = -1;
  var isDragging = false;
  var selectedLineType = -1;

  const colorEnum = {
    black: [0, 0, 0],
    blue: [0, 0, 255],
    yellow: [255, 255, 0],
    red: [255, 0, 0],
    green: [0, 128, 0],
  };

  var offsetX = JSON.parse(localStorage.getItem('offsetX')) || 0;
  var offsetY = JSON.parse(localStorage.getItem('offsetY')) || 0;
  var lines = JSON.parse(localStorage.getItem('lines')) || getDefaultLines();

  var canvasOffsetX = 0
  var canvasOffsetY = 0

  var currentMouseDownPoint = {}
  var currentMouseDownXYLine = {}

  const canvasType = {
    gridLines: 1,
    verticalLines: 2,
    horizontalLines: 3,
    points: 4,
    regions: 5
  };

  var fontKey = [

    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M1",
    "M2",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W1",
    "W2",
    "X",
    "Y",
    "Z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    ".",
    ",",
    ":",
    "'",
    "!",
    "?",
    " "
  ]
  var fontEnum = {
    A: [[0, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [1, 1, 0, 0, 0], [1], [0, 0, 0, 0, 0], [0], [0, 1], [1], [1, 1, 1, 1], [1], [1, 1]],
    B: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [0, 1, 0, 0, 1], [1], [0, 1, 0, 0, 1], [1], [0, 1], [1], [1, 0, 1, 1], [1], [1, 0]],
    C: [[0, 1], [1], [1, 1, 1, 1], [1], [1, 0], [1], [1, 1, 0, 0, 0], [0], [0, 0, 0, 1, 1], [1], [0, 1], [1], [0, 0, 0, 0], [1], [1, 0]],
    D: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [0, 1, 0, 0, 0], [0], [0, 0, 0, 0, 1], [1], [0, 1], [1], [1, 1, 1, 1], [1], [1, 0]],
    E: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [0, 0, 0, 0, 0], [1], [0, 0, 0, 0, 0], [1], [1, 1], [0], [1, 1, 1, 1], [0], [1, 1]],
    F: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [0, 0, 0, 0, 0], [1], [0, 0, 0, 0, 0], [0], [1, 1], [0], [1, 1, 1, 1], [0], [0, 0]],
    G: [[0, 1], [1], [1, 1, 1, 1], [1], [1, 0], [1], [1, 0, 0, 0, 0], [1], [0, 0, 0, 1, 1], [1], [1, 1], [0], [1, 0, 1, 1], [1], [1, 0]],
    H: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [0], [0, 0, 0, 0, 0], [1], [0, 0, 0, 0, 0], [0], [1, 1], [1], [1, 1, 1, 1], [1], [1, 1]],
    I: [[1, 1], [0], [0, 0, 0, 0], [0], [1, 1], [1], [1, 1, 1, 1, 1], [1], [1, 1, 1, 1, 1], [1], [1, 1], [0], [0, 0, 0, 0], [0], [1, 1]],
    J: [[1, 1], [0], [0, 0, 0, 0], [1], [1, 0], [1], [0, 0, 0, 0, 0], [0], [0, 0, 0, 1, 1], [1], [1, 1], [1], [1, 1, 1, 1], [1], [1, 0]],
    K: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [0], [0, 0, 0, 0, 0], [1], [0, 0, 0, 0, 0], [0], [1, 1], [1], [1, 0, 0, 0], [1], [1, 1]],
    L: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [0], [0, 0, 0, 0, 0], [0], [0, 0, 0, 0, 0], [1], [0, 0], [0], [0, 0, 0, 0], [0], [1, 1]],
    M1: [[0, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [1, 1, 0, 0, 0], [0], [0, 0, 0, 0, 0], [0], [0, 1], [1], [1, 1, 1, 1], [0], [0, 0]],
    M2: [[0, 1], [1], [1, 1, 1, 1], [0], [0, 0], [1], [1, 1, 0, 0, 0], [0], [0, 0, 0, 0, 0], [0], [0, 1], [1], [1, 1, 1, 1], [1], [1, 1]],
    N: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [0, 1, 0, 0, 0], [0], [0, 0, 0, 0, 0], [0], [0, 1], [1], [1, 1, 1, 1], [1], [1, 1]],
    O: [[0, 1], [1], [1, 1, 1, 1], [1], [1, 0], [1], [1, 1, 0, 0, 0], [0], [0, 0, 0, 1, 1], [1], [0, 1], [1], [1, 1, 1, 1], [1], [1, 0]],
    P: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [0, 1, 0, 0, 1], [1], [0, 0, 0, 0, 0], [0], [0, 1], [1], [1, 0, 0, 0], [0], [0, 0]],
    Q: [[0, 1], [1], [1, 1, 1, 1], [1], [1, 0], [1], [1, 1, 0, 0, 0], [0], [0, 0, 0, 1, 1], [1], [0, 1], [1], [1, 1, 1, 1], [1], [1, 1]],
    R: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 1], [1], [0, 1, 0, 0, 1], [1], [0, 0, 0, 0, 0], [0], [0, 1], [1], [1, 0, 0, 0], [1], [1, 1]],
    S: [[0, 1], [1], [1, 0, 0, 0], [0], [1, 1], [1], [1, 0, 0, 1, 0], [1], [0, 1, 0, 0, 1], [1], [1, 1], [0], [0, 0, 1, 0], [1], [1, 0]],
    T: [[1, 1], [0], [0, 0, 0, 0], [0], [0, 0], [1], [1, 1, 1, 1, 1], [1], [1, 1, 1, 1, 1], [1], [1, 1], [0], [0, 0, 0, 0], [0], [0, 0]],
    U: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 0], [0], [0, 0, 0, 0, 0], [0], [0, 0, 0, 1, 0], [1], [1, 1], [1], [1, 1, 1, 1], [1], [1, 1]],
    V: [[1, 1], [1], [1, 1, 1, 1], [1], [0, 0], [0], [0, 0, 0, 0, 0], [0], [0, 0, 0, 0, 0], [1], [1, 1], [1], [1, 1, 1, 1], [1], [0, 0]],
    W1: [[1, 1], [1], [1, 1, 1, 1], [1], [1, 0], [0], [0, 0, 0, 0, 0], [0], [0, 0, 0, 0, 0], [1], [0, 0], [1], [1, 1, 1, 1], [1], [1, 0]],
    W2: [[0, 0], [1], [1, 1, 1, 1], [1], [1, 0], [0], [0, 0, 0, 0, 0], [0], [0, 0, 0, 0, 0], [1], [1, 1], [1], [1, 1, 1, 1], [1], [1, 0]],
    X: [[1, 1], [1], [1, 0, 0, 0], [1], [1, 1], [0], [0, 0, 0, 1, 0], [1], [0, 1, 0, 0, 0], [0], [1, 1], [1], [0, 0, 1, 1], [1], [1, 1]],
    Y: [[1, 1], [1], [1, 0, 0, 0], [0], [1, 1], [0], [0, 0, 0, 1, 1], [1], [0, 0, 0, 0, 1], [1], [1, 1], [1], [1, 1, 1, 1], [1], [1, 0]],
    Z: [[1, 1], [0], [0, 0, 1, 1], [1], [1, 1], [1], [0, 0, 0, 0, 1], [1], [1, 0, 0, 0, 0], [1], [1, 1], [1], [1, 0, 0, 0], [0], [1, 1]],
    1: [[1, 1], [0], [0, 0, 0, 0], [0], [1, 1], [1], [1, 1, 1, 1, 1], [1], [1, 1, 1, 1, 1], [1], [0, 0], [0], [0, 0, 0, 0], [0], [1, 1]],
    2: [[0, 1], [1], [0, 0, 1, 1], [1], [1, 1], [1], [1, 1, 0, 0, 1], [1], [1, 0, 0, 0, 0], [1], [0, 1], [1], [1, 0, 0, 1], [0], [1, 1]],
    3: [[0, 1], [1], [0, 0, 0, 0], [1], [1, 0], [1], [1, 1, 0, 0, 1], [1], [0, 1, 0, 0, 1], [1], [0, 1], [1], [1, 1, 1, 1], [1], [1, 0]],
    4: [[1, 1], [1], [1, 0, 0, 0], [0], [0, 0], [0], [0, 0, 0, 1, 0], [1], [0, 0, 0, 0, 0], [0], [1, 1], [1], [1, 1, 1, 1], [1], [1, 1]],
    5: [[1, 1], [1], [1, 0, 0, 0], [1], [1, 0], [1], [0, 0, 0, 1, 0], [1], [0, 1, 0, 1, 1], [1], [1, 1], [0], [0, 0, 1, 0], [1], [1, 0]],
    6: [[0, 1], [1], [1, 1, 1, 1], [1], [1, 0], [1], [1, 0, 0, 0, 0], [1], [1, 1, 0, 1, 1], [1], [1, 1], [0], [0, 0, 1, 1], [1], [1, 0]],
    7: [[1, 1], [0], [0, 0, 0, 0], [0], [0, 0], [1], [0, 0, 0, 0, 0], [0], [0, 0, 0, 0, 0], [0], [1, 1], [1], [1, 1, 1, 1], [1], [1, 1]],
    8: [[0, 1], [1], [1, 0, 1, 1], [1], [1, 0], [1], [1, 1, 0, 1, 1], [1], [1, 1, 0, 1, 1], [1], [0, 1], [1], [1, 0, 1, 0], [1], [1, 0]],
    9: [[0, 1], [1], [1, 0, 0, 0], [0], [1, 1], [1], [1, 1, 0, 1, 1], [1], [0, 0, 0, 0, 1], [1], [0, 1], [1], [1, 1, 1, 1], [1], [1, 0]],
    10: [[0, 1], [1], [1, 1, 1, 1], [1], [1, 0], [1], [1, 1, 0, 0, 0], [0], [0, 0, 0, 1, 1], [1], [0, 1], [1], [1, 1, 1, 0], [1], [1, 0]],
    ".": [[0, 0], [0], [0, 0, 0, 0], [0], [0, 0], [0], [0, 0, 0, 0, 0], [0], [0, 0, 1, 0, 0], [0], [0, 0], [0], [0, 0, 0, 0], [0], [0, 0]],
    ",": [[0, 0], [0], [0, 0, 0, 0], [0], [0, 0], [0], [0, 0, 0, 0, 0], [0], [0, 0, 1, 1, 1], [1], [0, 0], [0], [0, 0, 0, 0], [0], [0, 0]],
    ":": [[0, 0], [0], [0, 0, 0, 0], [0], [0, 0], [0], [0, 0, 1, 0, 0], [0], [0, 0, 1, 0, 0], [0], [0, 0], [0], [0, 0, 0, 0], [0], [0, 0]],
    "'": [[0, 0], [0], [0, 0, 0, 0], [0], [0, 0], [0], [0, 0, 1, 0, 0], [0], [0, 0, 1, 1, 1], [1], [0, 0], [0], [0, 0, 0, 0], [0], [0, 0]],
    "!": [[0, 0], [0], [0, 0, 0, 0], [0], [0, 0], [1], [1, 1, 1, 1, 1], [1], [0, 0, 0, 0, 0], [1], [0, 0], [0], [0, 0, 0, 0], [0], [0, 0]],
    "?": [[1, 1], [0], [0, 0, 0, 0], [0], [0, 0], [1], [0, 1, 0, 0, 1], [1], [0, 0, 0, 0, 0], [1], [0, 1], [1], [1, 0, 0, 0], [0], [0, 0]],
    " ": [[0, 0], [0], [0, 0, 0, 0], [0], [0, 0], [0], [0, 0, 0, 0, 0], [0], [0, 0, 0, 0, 0], [0], [0, 0], [0], [0, 0, 0, 0], [0], [0, 0]],
  }
  useEffect(() => {
    localStorage.setItem('canvasBounding', JSON.stringify(defaultCanvasBounding));
    localStorage.setItem('lines', JSON.stringify(getDefaultLines()));
    canvasBounding = defaultCanvasBounding;
    lines = getDefaultLines();
    // localStorage.setItem('offsetX', (canvas.width / 2 - canvasBounding.width / 2));
    // localStorage.setItem('offsetY', (canvas.height / 2 - canvasBounding.height / 2));

    initData()
 

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

  
    draw();
    canvasDrawData()

  
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);


  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  // const handleScroll = () => {
  //   const scrollHeight = document.documentElement.scrollHeight;
  //   const scrollTop = document.documentElement.scrollTop;
  //   const clientHeight = document.documentElement.clientHeight;
    
  //   if (scrollTop + clientHeight >= scrollHeight * 0.8) {
  //     // fetchMoreData();
  //     console.log("加载")
  //   }
  // };

  const browseArchiveClick = () => {
    dispatch(setBrowseArchiveFlag(true))

  }

  const back = () => {
    dispatch(setBrowseArchiveFlag(false))

  }

  useEffect(() => {

    if (browseArchiveFlag) {
      document.getElementById('rightFontList').innerHTML = ''
      setFontLoading(() => true)
      fetch('http://101.35.188.172:5000/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(res => res.json())
        .then(data => {
          for(let i=0;i<data.length;i++){
            fetchImages(data[i])
          }
    

          // console.log(data)
          
        })
      const rightBlock = document.querySelectorAll('.page-wrapper');

      rightBlock.forEach(container => {
        container.style.display = `none`;
      });
      document.querySelectorAll('.Archive-wrapper')[0].style.display = `flex`;
    } else {
      const rightBlock = document.querySelectorAll('.page-wrapper');

      rightBlock.forEach(container => {
        container.style.display = `flex`;
      });
      document.querySelectorAll('.Archive-wrapper')[0].style.display = `none`
    }


  }, [browseArchiveFlag]);

  const IsTypeActiveClick = (flag) => {
    setIsDomTypeActive(flag)
    // isTypeActive = flag
    // // dispatch()
    // initData()
    // draw()
    // canvasDrawData()
  }

  const IsGridActiveClick = (flag) => {
    dispatch(setIsGridActive(flag));
    // setIsGridActive(() => flag)
    // console.log(isGridActive,flag)
   
  }

  const handleSpaceChange = (value) => {
    dispatch(setSpaceValue(value));
  }



  useEffect(() => {
    initData()
    draw()
    canvasDrawData()
  }, [isDomTypeActive]);

  useEffect(() => {
    initData()
    draw()
    canvasDrawData()

  }, [isGridActive]);

  useEffect(() => {
    initData()
    draw()
    canvasDrawData()
 
  }, [fontSizeValue]);

  useEffect(() => {
    
    initData()
    draw()
    canvasDrawData()
  
  }, [colorValue]);

  useEffect(() => {

    const rightBlock = document.querySelectorAll('.right-block div');
    // console.log(rightBlock)
    rightBlock.forEach(container => {
      container.style.justifyContent = `${alignValue}`;
    });

  }, [alignValue]);

  useEffect(() => {

    const canvasContainers = document.querySelectorAll('.canvas-container');
    canvasContainers.forEach(container => {
      container.style.marginLeft = `${spaceValue}px`;
    });
  }, [spaceValue]);

  useEffect(() => {
    const canvasContainers = document.querySelectorAll('.canvas-container');
    canvasContainers.forEach(container => {
      container.style.marginBottom = `${lineValue}px`;
      container.style.marginTop = `-7px`;
    });
  }, [lineValue]);


  useEffect(() => {
    const canvasContainers = document.querySelectorAll('.right-block');
    if (middleValue) {
      canvasContainers.forEach(container => {
        container.style.alignContent = `center`;
        container.style.alignItem = `center`;
      });
    } else {
      canvasContainers.forEach(container => {
        container.style.alignContent = `flex-start`;
        container.style.alignItem = `flex-start`;
      });
    }

  }, [middleValue]);

  const onFontSizeChange = (value) => {
    // setFontSizeValue(() => value)
    dispatch(setFontSizeValue(value));
  }

  const downloadClick = () => {
    setLoading(()=> true);
    uploadFlagGlobe = true
    dispatch(setUploadFlag(true))

    canvasBounding = JSON.parse(localStorage.getItem('canvasBounding')) ;
    offsetX = JSON.parse(localStorage.getItem('offsetX'));
    offsetY = JSON.parse(localStorage.getItem('offsetY'));
    lines= JSON.parse(localStorage.getItem('lines'))

    globeId = generateId();
    console.log(globeId)
    initData()
    draw()
    canvasDrawData()
    setLoading(()=> false);
  }
 

  var aboutEnum = ["T", "Y", "P", "E", "F", "L", "E", "X", "I", " ", "I", "N", "T", "R", "O", "D", "U", "C", "E", "S", " ", "A", " ", "G", "E", "N", "E", "R", "A", "T", "I", "V", "E", " ", "T", "Y", "P", "E", " ", "C", "O", "N", "C", "E", "P", "T", ".", " ", "C", "O", "N", "S", "T", "R", "U", "C", "T", "E", "D", " ", "S", "Y", "S", "T", "E", "M", "A", "T", "I", "C", "A", "L", "L", "Y", " ", "F", "R", "O", "M", " ", "M", "O", "D", "U", "L", "A", "R", " ", "E", "L", "E", "M", "E", "N", "T", "S", ",", " ", "I", "T", " ", "S", "E", "R", "V", "E", "S", " ", "A", "S", " ", "T", "H", "E", " ", "F", "O", "U", "N", "D", "A", "T", "I", "O", "N", " ", "F", "O", "R", " ", "A", "N", " ", "E", "N", "D", "L", "E", "S", "S", " ", "A", "R", "R", "A", "Y", " ", "O", "F", " ", "U", "N", "I", "Q", "U", "E", " ", "L", "E", "T", "T", "E", "R", "F", "O", "R", "M", "S", ".", " ", "B", "Y", " ", "I", "N", "T", "U", "I", "T", "I", "V", "E", "L", "Y", " ", "D", "R", "A", "G", "G", "I", "N", "G", " ", "F", "E", "W", " ", "C", "O", "N", "T", "R", "O", "L", " ", "P", "O", "I", "N", "T", "S", " ", "O", "N", " ", "T", "H", "E", " ", "B", "A", "S", "E", " ", "G", "R", "I", "D", ",", " ", "U", "S", "E", "R", "S", " ", "C", "A", "N", " ", "E", "F", "F", "O", "R", "T", "L", "E", "S", "S", "L", "Y", " ", "M", "O", "L", "D", " ", "T", "H", "E", "I", "R", " ", "O", "W", "N", " ", "F", "O", "N", "T", " ", "V", "A", "R", "I", "A", "T", "I", "O", "N", "S", "."]


  var authorEnum = ["D", "E", "S", "I", "G", "N", "E", "D", " ", "B", "Y", " ", "M", "A", "N", "K", "U", "N", " ", "G", "U", "O"]
  // 绘制圆形
  const drawCircle = (context, x, y, radius) => {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.stroke();
  };

  //绘制点
  const drawLineControlPoint = (context, x, y) => {
    context.beginPath();
    context.arc(x, y, 6, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  };


  // 绘制线
  const drawLine = (context, x1, y1, x2, y2) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };

  //绘制矩形
  function drawRoundedRectangleTopLeft(context, x, y, width, height, borderRadius) {
    context.fillStyle = 'rgb(254,254, 254)';
    context.beginPath();
    context.moveTo(x + borderRadius, y);
    context.lineTo(x + width, y);
    context.lineTo(x + width, y + height);
    context.lineTo(x, y + height);
    context.lineTo(x, y + borderRadius);
    context.arcTo(x, y, x + borderRadius, y, borderRadius);
    context.closePath();
    context.stroke();
    context.fill()
    context.fillStyle = 'rgb(255, 255, 255)';
  }

  function drawRoundedRectangleBottomLeft(context, x, y, width, height, borderRadius) {
    context.fillStyle = 'rgb(254, 254, 0)';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y);
    context.lineTo(x + width, y + height - borderRadius);
    context.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
    context.lineTo(x, y + height);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    // context.fill()
    context.fillStyle = 'rgb(255, 255, 255)';
  }

  function drawRoundedRectangleTopRight(context, x, y, width, height, borderRadius) {
    context.fillStyle = 'rgb(254, 254, 254)';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width - borderRadius, y);
    context.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
    context.lineTo(x + width, y + height);
    context.lineTo(x, y + height);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    // context.fill()
    context.fillStyle = 'rgb(255, 255, 255)';
  }

  function drawRoundedRectangleBottomRight(context, x, y, width, height, borderRadius) {
    context.fillStyle = 'rgb(254, 0, 254)';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y);
    context.lineTo(x + width, y + height);
    context.lineTo(x + borderRadius, y + height);
    context.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    // context.fill()
    context.fillStyle = 'rgb(255, 255, 255)';
  }

  function drawRoundedRectangleAllCorners(context, x, y, width, height, borderRadius) {
    context.beginPath();
    context.moveTo(x + borderRadius, y);
    context.lineTo(x + width - borderRadius, y);
    context.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
    context.lineTo(x + width, y + height - borderRadius);
    context.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
    context.lineTo(x + borderRadius, y + height);
    context.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
    context.lineTo(x, y + borderRadius);
    context.arcTo(x, y, x + borderRadius, y, borderRadius);
    context.closePath();
    context.stroke();
  }
  //绘制矩形
  function createPathRoundedRectangleTopLeft(x, y, width, height, borderRadius) {
    const path = new Path2D();
    path.moveTo(x + borderRadius, y);
    path.lineTo(x + width, y);
    path.lineTo(x + width, y + height);
    path.lineTo(x, y + height);
    path.lineTo(x, y + borderRadius);
    path.arcTo(x, y, x + borderRadius, y, borderRadius);
    path.closePath();
    return path
  }

  function createPathRoundedRectangleBottomLeft(x, y, width, height, borderRadius) {
    const path = new Path2D();
    path.moveTo(x, y);
    path.lineTo(x + width, y);
    path.lineTo(x + width, y + height - borderRadius);
    path.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
    path.lineTo(x, y + height);
    path.lineTo(x, y);
    path.closePath();
    return path
  }

  function createPathRoundedRectangleTopRight(x, y, width, height, borderRadius) {
    const path = new Path2D();
    path.moveTo(x, y);
    path.lineTo(x + width - borderRadius, y);
    path.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
    path.lineTo(x + width, y + height);
    path.lineTo(x, y + height);
    path.lineTo(x, y);
    path.closePath();
    return path
  }

  function createPathRoundedRectangleBottomRight(x, y, width, height, borderRadius) {
    const path = new Path2D();
    path.moveTo(x, y);
    path.lineTo(x + width, y);
    path.lineTo(x + width, y + height);
    path.lineTo(x + borderRadius, y + height);
    path.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
    path.lineTo(x, y);
    path.closePath();
    return path
  }

  function createPathRoundedRectangleAllCorners(x, y, width, height, borderRadius) {
    const path = new Path2D();
    path.moveTo(x + borderRadius, y);
    path.lineTo(x + width - borderRadius, y);
    path.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
    path.lineTo(x + width, y + height - borderRadius);
    path.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
    path.lineTo(x + borderRadius, y + height);
    path.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
    path.lineTo(x, y + borderRadius);
    path.arcTo(x, y, x + borderRadius, y, borderRadius);
    path.closePath();
    return path
  }


  function generateId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}-${milliseconds}`;
  }

  const downloadImg =(param) => {
    fetch('http://101.35.188.172:5000/getImages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(param)
    })
      .then(res => res.blob())
      .then(blob => {
        const zipUrl = URL.createObjectURL(blob);
        const aElement = document.createElement('a');
        aElement.href = zipUrl;
        aElement.download = 'font.zip';
        aElement.click();
        URL.revokeObjectURL(zipUrl);
      });
  }

  const fetchImages = (dir) => {
    const rightFontListContainer = document.getElementById('rightFontList')
    const divElement = document.createElement('div');
    divElement.id = dir
    divElement.className = "right-Font-block"
    rightFontListContainer.appendChild(divElement);

    const buttonElement = document.createElement('button');
    buttonElement.className = 'ant-btn btn-font-download'; // 添加 Ant Design 的按钮样式类名
    buttonElement.innerText = 'Download Font'; // 设置按钮文本
    // 定义事件处理程序
    const handleClick = (param) => {
      // 在此处处理点击事件
      console.log('Button clicked with parameter:', param);
      downloadImg(param)
    };

    // 绑定点击事件并传入参数
    buttonElement.addEventListener('click', () => handleClick(dir));
   
    rightFontListContainer.appendChild(buttonElement);
    const hrElement = document.createElement('hr');
    hrElement.className = "hr-block"
    rightFontListContainer.appendChild(hrElement);

    fetch('http://101.35.188.172:5000/getImages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dir)
    })
      .then(res => res.blob())
      .then(blob => {
        const zip = new JSZip();

        zip.loadAsync(blob).then(zip => {
          const imagePromises = [];
          zip.forEach((relativePath, file) => {
            const imagePromise = file.async('blob').then(fileBlob => {
              const imageUrl = URL.createObjectURL(fileBlob);
              console.log(file)
              return {
                fileName: file.name,
                imageUrl: imageUrl
              };
            });
            imagePromises.push(imagePromise);
          });

          Promise.all(imagePromises).then(images  => {

            const customOrder = [
              "A.png", "B.png", "C.png", "D.png", "E.png", "F.png", "G.png", "H.png", "I.png", "J.png",
              "K.png", "L.png", "M1.png", "M2.png", "N.png", "O.png", "P.png", "Q.png", "R.png", "S.png",
              "T.png", "U.png", "V.png", "W1.png", "W2.png", "X.png", "Y.png", "Z.png", "1.png", "2.png",
              "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "0.png", "点.png", ",.png",
              "冒号.png", "'.png", "!.png", "问号.png", "空格.png"
            ];
  
            // 根据自定义顺序进行排序
            images.sort((a, b) => {
              const indexA = customOrder.indexOf(a.fileName);
              const indexB = customOrder.indexOf(b.fileName);
              return indexA - indexB;
            });
            console.log(images);
            // const sortedImageUrls = images.map(image => image);
            

             // 创建 <div> 和 <img> 元素，并将图像添加到相应的元素中
            const container = document.getElementById(dir);
            // console.log(container)

            for(let i = 0; i<images.length; i++){
            // images.forEach(image => {
            
              const imgElement = document.createElement('img');
              imgElement.src = images[i].imageUrl;
              const divElement1 = document.createElement('div');
              divElement1.appendChild(imgElement);

              if(images[i].fileName === "W1.png" || images[i].fileName === "M1.png" ){
                const imgElement2 = document.createElement('img');
                imgElement2.src = images[i+1].imageUrl;
                divElement1.appendChild(imgElement2);
              }

              if(images[i].fileName === "W2.png" || images[i].fileName === "M2.png" ){
                continue
              }

              container.appendChild(divElement1);
            }


            setFontLoading(() => false)
          });
        });
      });
  };

  // const downloadImages = (dir) => {
    

  //   fetch('http://101.35.188.172:5000/getImages', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(dir)
  //   })
  //     .then(res => res.blob())
  //     .then(blob => {
  //       const zipUrl = URL.createObjectURL(blob);
  //       const aElement = document.createElement('a');
  //       aElement.href = zipUrl;
  //       aElement.download = 'font.zip';
  //       aElement.click();
  //       URL.revokeObjectURL(zipUrl);
  //     });
  // };

  const draw = () => {
    const drawContext = ctx
    drawContext.clearRect(0, 0, canvas.width, canvas.height);
    [offsetX, offsetY] = [(canvas.width / 2 - canvasBounding.width / 2), (canvas.height / 2 - canvasBounding.height / 2)];
    // localStorage.setItem('offsetX', (canvas.width / 2 - canvasBounding.width / 2));
    // localStorage.setItem('offsetY', (canvas.height / 2 - canvasBounding.height / 2));

    // 绘制线
    drawContext.strokeStyle = "black";
    //drawContext.strokeStyle = "red";

    drawContext.rect(canvasOffsetX, canvasOffsetY, canvasBounding.width, canvasBounding.height);
    drawContext.lineWidth = 1;
    drawContext.stroke();

    //绘制最上的点
    drawCircle(drawContext, canvasOffsetX + canvasBounding.width, canvasOffsetY, 6)
    drawContext.fill();

    //绘制圆
    let centerRadiusX = (lines[1].x1 - lines[0].x1)
    let centerRadiusY = (lines[3].y1 - lines[2].y1)
    corner11 = createPathRoundedRectangleAllCorners(offsetX + lines[0].x1, offsetY + lines[2].y1, centerRadiusX, centerRadiusY, Math.min(centerRadiusX, centerRadiusY) / 2)
    corner31 = createPathRoundedRectangleAllCorners(offsetX + lines[0].x1, lines[4].y1 + offsetY, centerRadiusX, lines[5].y1 - lines[4].y1, Math.min(centerRadiusX, lines[5].y1 - lines[4].y1) / 2)
    drawContext.stroke(corner11)
    drawContext.stroke(corner31)
    lines.forEach((line) => {
      drawLine(drawContext, line.x1 + offsetX, line.y1 + offsetY, line.x2 + offsetX - 0.5, line.y2 + offsetY)
    });


    for (let i = 0; i < 2; i++) {
      for (let j = 2; j < 6; j++) {
        var borderRadius = ''
        if (i == 0 && j == 2) {
          borderRadius = Math.min(lines[i].x1, lines[j].y1);
          path02 = createPathRoundedRectangleTopLeft(offsetX, offsetY, lines[i].x1, lines[j].y1, borderRadius)
          drawContext.stroke(path02)

        }
        if (i == 1 && j == 2) {
          borderRadius = Math.min(canvasBounding.width - lines[i].x1, lines[j].y1);
          path12 = createPathRoundedRectangleTopRight(offsetX + lines[i].x1, offsetY, canvasBounding.width - lines[i].x1, lines[j].y1, borderRadius)
          drawContext.stroke(path12)
        }

        if (i == 0 && j == 3) {
          const dy = lines[j + 1].y1 - lines[j].y1;
          borderRadius = Math.min(lines[i].x1, dy);
          path03 = createPathRoundedRectangleBottomRight(offsetX, lines[j].y1 + offsetY, lines[i].x1, dy, borderRadius)
          drawContext.stroke(path03)
        }
        if (i == 1 && j == 3) {
          const dy = lines[j + 1].y1 - lines[j].y1;
          borderRadius = Math.min(canvasBounding.width - lines[i].x1, dy);
          path13 = createPathRoundedRectangleBottomLeft(offsetX + lines[i].x1, lines[j].y1 + offsetY, canvasBounding.width - lines[i].x1, dy, borderRadius)
          drawContext.stroke(path13)
        }



        if (i == 0 && j == 4) {
          const dy = lines[j].y1 - lines[j - 1].y1;
          borderRadius = Math.min(lines[i].x1, dy);
          path04 = createPathRoundedRectangleTopLeft(offsetX, lines[j - 1].y1 + offsetY, lines[i].x1, dy, borderRadius)

          drawContext.stroke(path04)
        }

        if (i == 1 && j == 4) {
          const dy = lines[j].y1 - lines[j - 1].y1;
          borderRadius = Math.min(canvasBounding.width - lines[i].x1, dy);
          path14 = createPathRoundedRectangleTopRight(offsetX + lines[i].x1, offsetY + lines[j - 1].y1, canvasBounding.width - lines[i].x1, dy, borderRadius)
          drawContext.stroke(path14)
        }

        if (i == 0 && j == 5) {
          const dy = canvasBounding.height - lines[j].y1;
          borderRadius = Math.min(lines[i].x1, dy);
          //drawRoundedRectangleBottomRight(drawContext,offsetX, lines[j].y1 + offsetY, lines[i].x1, dy, borderRadius)
          path05 = createPathRoundedRectangleBottomRight(offsetX, lines[j].y1 + offsetY, lines[i].x1, dy, borderRadius)
          drawContext.stroke(path05)
        }


        if (i == 1 && j == 5) {
          const dy = canvasBounding.height - lines[j].y1;
          borderRadius = Math.min(canvasBounding.width - lines[i].x1, dy);
          // drawRoundedRectangleBottomLeft(drawContext,offsetX + lines[i].x1, lines[j].y1 + offsetY, canvasBounding.width - lines[i].x1, dy, borderRadius)

          path15 = createPathRoundedRectangleBottomLeft(offsetX + lines[i].x1, lines[j].y1 + offsetY, canvasBounding.width - lines[i].x1, dy, borderRadius)
          drawContext.stroke(path15)
        }

        drawLineControlPoint(drawContext, lines[i].x1 + offsetX, lines[j].y1 + offsetY)
      }
    }

  };

  const drawCanvasData = (key,blockIndex) => {

    if (ctxHide == null) {
      canvas = canvasRef.current;
      canvasHide = canvasHideRef.current
      canvasTemp = canvasTempRef.current


      ctx = canvas.getContext('2d');
      ctxHide = canvasHide.getContext('2d');
      ctxTemp = canvasTemp.getContext('2d');
    }

    const drawContext = ctxHide

    drawContext.clearRect(0, 0, canvas.width, canvas.height);
    [offsetX, offsetY] = [(canvas.width / 2 - canvasBounding.width / 2), (canvas.height / 2 - canvasBounding.height / 2)];



    // 绘制线
    if (isGridActive) {
      drawContext.strokeStyle = "#222";
    } else {
      drawContext.strokeStyle = "rgba(0, 0, 0, 0)";
    }

    //绘制圆
    let centerRadiusX = (lines[1].x1 - lines[0].x1)
    let centerRadiusY = (lines[3].y1 - lines[2].y1)
    drawRoundedRectangleAllCorners(drawContext, offsetX + lines[0].x1, offsetY + lines[2].y1, centerRadiusX, centerRadiusY, Math.min(centerRadiusX, centerRadiusY) / 2)
    drawRoundedRectangleAllCorners(drawContext, offsetX + lines[0].x1, lines[4].y1 + offsetY, centerRadiusX, lines[5].y1 - lines[4].y1, Math.min(centerRadiusX, lines[5].y1 - lines[4].y1) / 2)

    corner11 = createPathRoundedRectangleAllCorners(offsetX + lines[0].x1, offsetY + lines[2].y1, centerRadiusX, centerRadiusY, Math.min(centerRadiusX, centerRadiusY) / 2)
    corner31 = createPathRoundedRectangleAllCorners(offsetX + lines[0].x1, lines[4].y1 + offsetY, centerRadiusX, lines[5].y1 - lines[4].y1, Math.min(centerRadiusX, lines[5].y1 - lines[4].y1) / 2)


    drawContext.rect(canvasOffsetX, canvasOffsetY, canvasBounding.width, canvasBounding.height);
    drawContext.lineWidth = 1;
    drawContext.stroke();


    lines.forEach((line, index) => {
      drawLine(drawContext, line.x1 + offsetX, line.y1 + offsetY, line.x2 + offsetX - 0.5, line.y2 + offsetY)
    });


    for (let i = 0; i < 2; i++) {
      for (let j = 2; j < 6; j++) {
        var borderRadius = ''
        if (i == 0 && j == 2) {
          borderRadius = Math.min(lines[i].x1, lines[j].y1);
          //  / drawRoundedRectangleTopLeft(drawContext,offsetX, offsetY, lines[i].x1, lines[j].y1, borderRadius)
          path02 = createPathRoundedRectangleTopLeft(offsetX, offsetY, lines[i].x1, lines[j].y1, borderRadius)
          drawContext.stroke(path02)

        }
        if (i == 1 && j == 2) {
          borderRadius = Math.min(canvasBounding.width - lines[i].x1, lines[j].y1);
          path12 = createPathRoundedRectangleTopRight(offsetX + lines[i].x1, offsetY, canvasBounding.width - lines[i].x1, lines[j].y1, borderRadius)

          drawContext.stroke(path12)
        }

        if (i == 0 && j == 3) {
          const dy = lines[j + 1].y1 - lines[j].y1;
          borderRadius = Math.min(lines[i].x1, dy);
          path03 = createPathRoundedRectangleBottomRight(offsetX, lines[j].y1 + offsetY, lines[i].x1, dy, borderRadius)
          drawContext.stroke(path03)
        }
        if (i == 1 && j == 3) {
          const dy = lines[j + 1].y1 - lines[j].y1;
          borderRadius = Math.min(canvasBounding.width - lines[i].x1, dy);
          path13 = createPathRoundedRectangleBottomLeft(offsetX + lines[i].x1, lines[j].y1 + offsetY, canvasBounding.width - lines[i].x1, dy, borderRadius)
          drawContext.stroke(path13)
        }

        if (i == 0 && j == 4) {
          const dy = lines[j].y1 - lines[j - 1].y1;
          borderRadius = Math.min(lines[i].x1, dy);
          path04 = createPathRoundedRectangleTopLeft(offsetX, lines[j - 1].y1 + offsetY, lines[i].x1, dy, borderRadius)

          drawContext.stroke(path04)
        }

        if (i == 1 && j == 4) {
          const dy = lines[j].y1 - lines[j - 1].y1;
          borderRadius = Math.min(canvasBounding.width - lines[i].x1, dy);
          path14 = createPathRoundedRectangleTopRight(offsetX + lines[i].x1, offsetY + lines[j - 1].y1, canvasBounding.width - lines[i].x1, dy, borderRadius)
          drawContext.stroke(path14)
        }

        if (i == 0 && j == 5) {
          const dy = canvasBounding.height - lines[j].y1;
          borderRadius = Math.min(lines[i].x1, dy);
          path05 = createPathRoundedRectangleBottomRight(offsetX, lines[j].y1 + offsetY, lines[i].x1, dy, borderRadius)
          drawContext.stroke(path05)
        }


        if (i == 1 && j == 5) {
          const dy = canvasBounding.height - lines[j].y1;
          borderRadius = Math.min(canvasBounding.width - lines[i].x1, dy);
          path15 = createPathRoundedRectangleBottomLeft(offsetX + lines[i].x1, lines[j].y1 + offsetY, canvasBounding.width - lines[i].x1, dy, borderRadius)
          drawContext.stroke(path15)
        }


      }
    }

    if (key == "M") {
      drawCanvasData("M1")
      drawCanvasData("M2")
    } else if (key == "W") {
      drawCanvasData("W1")
      drawCanvasData("W2")
    } else {
      canvasImageData(key, blockIndex)
    }
  }

  const canvasDrawData = () => {
    setLoading(()=> true);
    targetRef.current.querySelector('#letter_block').innerHTML = '';
    targetRef.current.querySelector('#number_block').innerHTML = '';
    targetRef.current.querySelector('#symbol_block').innerHTML = '';
    targetRef.current.querySelector('#about_block').innerHTML = '';
    targetRef.current.querySelector('#author_block').innerHTML = '';
    //清空输出区
    if (isDomTypeActive) {
      for (let key of fontKey) {
        drawCanvasData(key)
      }
    } else {
      for (let key of aboutEnum) {
        drawCanvasData(key,"about")
      }

      for(let key of authorEnum) {
        drawCanvasData(key,"author")
      }

    }
    if (uploadFlagGlobe) {
      uploadData()

    }

      setLoading(()=> false);

  }


  function checkCharacterType(character) {
    if (/[a-zA-Z]/.test(character)) {
      return "letter";
    } else if (/[0-9]/.test(character)) {
      return "number";
    } else {
      return "symbol";
    }
  }

  const canvasImageData = (currentFont1,blockIndex) => {
    var imageData;
    let currentFont = currentFont1;
    [offsetX, offsetY] = [(canvas.width / 2 - canvasBounding.width / 2), (canvas.height / 2 - canvasBounding.height / 2)];
    // [offsetX, offsetY] = [localStorage.getItem('offsetX'),localStorage.getItem('offsetY')];
    imageData = ctxHide.getImageData(offsetX, offsetY, parseInt(canvasBounding.width) + 2, parseInt(canvasBounding.height) + 2);


    var data = imageData.data;



    let colorDataRgb = colorEnum[colorValue] || colorEnum["black"]


    for (let y = 0; y < canvasBounding.height + 2; y++) {
      for (let x = 0; x < canvasBounding.width + 2; x++) {
        let idx = ((y * (canvasBounding.width + 2) + x) * 4)
        if (x <= lines[0].x1) {

          if (y <= lines[2].y1) {
            const isInsideShape02 = ctx.isPointInPath(path02, x + offsetX, y + offsetY);
            if (fontEnum[currentFont][0][0] == 1 && !isInsideShape02) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][0][1] == 1 && isInsideShape02) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }

          } else if (y < lines[3].y1) {
            //第二
            if (fontEnum[currentFont][1][0] == 1) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          }
          else if (y < lines[4].y1) {
            //第三
            const isInsideShape03 = ctx.isPointInPath(path03, x + offsetX, y + offsetY);
            const isInsideShape04 = ctx.isPointInPath(path04, x + offsetX, y + offsetY);

            if (fontEnum[currentFont][2][0] == 1 && isInsideShape03) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][2][1] == 1 && !isInsideShape03 && !isInsideShape04) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][2][2] == 1 && isInsideShape04) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          } else if (y < lines[5].y1) {
            //第四
            if (fontEnum[currentFont][3][0] == 1) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }

          } else {
            //第五
            const isInsideShape05 = ctx.isPointInPath(path05, x + offsetX, y + offsetY);
            if (fontEnum[currentFont][4][0] == 1 && isInsideShape05) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][4][1] == 1 && !isInsideShape05) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          }
        } else if (x <= lines[1].x1) {
          // console.log("中间")
          if (y < lines[2].y1) {
            //第一        
            if (fontEnum[currentFont][5][0] == 1) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          } else if (y < lines[3].y1) {
            //第二
            const isInsideCorner11 = ctx.isPointInPath(corner11, x + offsetX, y + offsetY);
            //左上     &&  y<lines[3].y1/2
            //console.log( x , (( lines[1].x1-  lines[0].x1 ) /2+  lines[0].x1) )
            // console.log( y , ((lines[3].y1 - lines[2].y1 ) /2+ lines[2].y1) )
            if (fontEnum[currentFont][6][0] == 1 && !isInsideCorner11 && y < ((lines[3].y1 - lines[2].y1) / 2 + lines[2].y1) && x < ((lines[1].x1 - lines[0].x1) / 2 + lines[0].x1)) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][6][1] == 1 && !isInsideCorner11 && y < ((lines[3].y1 - lines[2].y1) / 2 + lines[2].y1) && x > ((lines[1].x1 - lines[0].x1) / 2 + lines[0].x1)) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][6][2] == 1 && isInsideCorner11) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][6][3] == 1 && !isInsideCorner11 && y > ((lines[3].y1 - lines[2].y1) / 2 + lines[2].y1) && x < ((lines[1].x1 - lines[0].x1) / 2 + lines[0].x1)) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][6][4] == 1 && !isInsideCorner11 && y > ((lines[3].y1 - lines[2].y1) / 2 + lines[2].y1) && x > ((lines[1].x1 - lines[0].x1) / 2 + lines[0].x1)) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          } else if (y < lines[4].y1) {
            //第三           
            if (fontEnum[currentFont][7][0] == 1) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          } else if (y < lines[5].y1) {
            const isInsideCorner31 = ctx.isPointInPath(corner31, x + offsetX, y + offsetY);
            //第四           
            if (fontEnum[currentFont][8][0] == 1 && !isInsideCorner31 && y < ((lines[5].y1 - lines[4].y1) / 2 + lines[4].y1) && x < ((lines[1].x1 - lines[0].x1) / 2 + lines[0].x1)) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][8][1] == 1 && !isInsideCorner31 && y < ((lines[5].y1 - lines[4].y1) / 2 + lines[4].y1) && x > ((lines[1].x1 - lines[0].x1) / 2 + lines[0].x1)) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][8][2] == 1 && isInsideCorner31) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][8][3] == 1 && !isInsideCorner31 && y > ((lines[5].y1 - lines[4].y1) / 2 + lines[4].y1) && x < ((lines[1].x1 - lines[0].x1) / 2 + lines[0].x1)) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][8][4] == 1 && !isInsideCorner31 && y > ((lines[5].y1 - lines[4].y1) / 2 + lines[4].y1) && x > ((lines[1].x1 - lines[0].x1) / 2 + lines[0].x1)) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          }
          else {
            //第五      
            if (fontEnum[currentFont][9][0] == 1) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          }
        } else {
          // console.log("右")
          if (y < lines[2].y1) {
            //第一
            const isInsideShape12 = ctx.isPointInPath(path12, x + offsetX, y + offsetY);
            if (fontEnum[currentFont][10][0] == 1 && !isInsideShape12) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][10][1] == 1 && isInsideShape12) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }

          } else if (y < lines[3].y1) {
            //第二
            if (fontEnum[currentFont][11][0] == 1) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          }
          else if (y < lines[4].y1) {
            //第三
            const isInsideShape13 = ctx.isPointInPath(path13, x + offsetX, y + offsetY);
            const isInsideShape14 = ctx.isPointInPath(path14, x + offsetX, y + offsetY);

            if (fontEnum[currentFont][12][0] == 1 && isInsideShape13) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][12][1] == 1 && !isInsideShape13 && !isInsideShape14) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][12][2] == 1 && isInsideShape14) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          } else if (y < lines[5].y1) {
            //第四
            if (fontEnum[currentFont][13][0] == 1) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }

          } else {
            //第五
            const isInsideShape15 = ctx.isPointInPath(path15, x + offsetX, y + offsetY);
            if (fontEnum[currentFont][14][0] == 1 && isInsideShape15) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
            if (fontEnum[currentFont][14][1] == 1 && !isInsideShape15) {
              data[idx] = colorDataRgb[0];
              data[idx + 1] = colorDataRgb[1];
              data[idx + 2] = colorDataRgb[2];
              data[idx + 3] = 255;
            }
          }
        }
      }
    }
    // canvasHide.width = canvasBounding.width + 2
    // canvasHide.height = canvasBounding.height + 2
    ctxHide.putImageData(imageData, offsetX, offsetY);

    let widthData = parseInt(canvasBounding.width) + 2;
    let heightData = parseInt(canvasBounding.height) + 2;

    var a = ctxHide.getImageData(offsetX, offsetY, widthData, heightData)
    ctxTemp.clearRect(0, 0, widthData, heightData);


    canvasTemp.width = canvasBounding.width + 2
    canvasTemp.height = canvasBounding.height + 2
    ctxTemp.putImageData(a, 0, 0, 0, 0, widthData, heightData)


    // 将新Canvas转换为PNG图像
    const pngDataUri = canvasTemp.toDataURL("image/png", 1);
    // console.log(pngDataUri)
    // 创建一个新的SVG元素
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // 设置SVG元素的属性
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('width', widthData * fontSizeValue);
    svgElement.setAttribute('height', heightData * fontSizeValue);

    // 创建一个图像元素
    const imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    // 设置图像元素的属性
    imageElement.setAttribute('width', (widthData) * fontSizeValue);
    imageElement.setAttribute('height', (heightData) * fontSizeValue);
    imageElement.setAttribute('x', 0);
    imageElement.setAttribute('y', 0);
    imageElement.setAttribute('href', pngDataUri);

    // 将图像元素添加到SVG元素中
    // 将图像元素添加到SVG元素中
    svgElement.appendChild(imageElement);
    // 创建一个图像元素
    const img = new Image();

    // 设置图像元素的源为PNG数据URI
    img.src = pngDataUri;



    let base64data = {
      path: globeId,
      base64: pngDataUri.replace("data:image/png;base64,", ""),
      filename: currentFont1
    }

    base64dataArr.push(base64data)
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'canvas-container');
    newDiv.setAttribute('name', currentFont);
    newDiv.appendChild(svgElement);
    // 将新的<div>元素追加到DOM节点
    let currentType
    if (isDomTypeActive) {
      currentType = "#" + checkCharacterType(currentFont) + "_block"
    } else {
      if(blockIndex === "author"){
        currentType = "#author_block"
      }else{
        currentType = "#about_block"
      }
 
    }


    if (currentFont == 'M2') {
      const elements = document.getElementsByName('M1');
      const lastElement = elements[elements.length - 1];
      lastElement.appendChild(svgElement)
    } else if (currentFont == 'W2') {
      const elements = document.getElementsByName("W1");
      const lastElement = elements[elements.length - 1];
      lastElement.appendChild(svgElement)
      // document.getElementsByName("W1")[0].appendChild(svgElement)
    } else {
      targetRef.current.querySelector(currentType).appendChild(newDiv);
    }
  }

  const uploadData = () => {
    fetch('http://101.35.188.172:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(base64dataArr)
    })
      .then(res => res.json())
      .then(data => {
     
        messageApi.success('保存文件成功');
        downloadImg(globeId)
        dispatch(setUploadFlag(false))
        uploadFlagGlobe = false
      })

  }

  const initData = () => {

    canvas = canvasRef.current;
    canvasHide = canvasHideRef.current
    canvasTemp = canvasTempRef.current
    // localStorage.setItem('canvasBounding', JSON.stringify({ width: 205, height: 341 }));
    ctx = canvas.getContext('2d');
    ctxHide = canvasHide.getContext('2d');
    ctxTemp = canvasTemp.getContext('2d');
  
    // [offsetX, offsetY] = [(canvas.width / 2 - canvasBounding.width / 2), (canvas.height / 2 - canvasBounding.height / 2)];
    [offsetX, offsetY] = [(canvas.width / 2 - canvasBounding.width / 2), (canvas.height / 2 - canvasBounding.height / 2)];
    canvasOffsetX = offsetX
    canvasOffsetY = offsetY

  }

  const handleMouseDown = (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    const [offsetX, offsetY] = [(canvas.width / 2 - canvasBounding.width / 2), (canvas.height / 2 - canvasBounding.height / 2)];
    // localStorage.setItem('offsetX', (canvas.width / 2 - canvasBounding.width / 2));
    // localStorage.setItem('offsetY', (canvas.height / 2 - canvasBounding.height / 2));
    // [offsetX, offsetY] = [localStorage.getItem('offsetX'),localStorage.getItem('offsetY')];
    var currentLineType = -1;
    currentMouseDownXYLine = { x: 0, y: 0 }
    currentMouseDownPoint = { mouseX, mouseY, offsetX, offsetY, width: canvasBounding.width, height: canvasBounding.height }
    // console.log(currentMouseDownPoint)
    // console.log("鼠标", mouseX, mouseY, "偏移", offsetX, offsetY)
    // console.log(ctx.isPointInPath(mouseX, mouseY))
    // drawCircle(mouseX, mouseY, 4)
    // console.log(lines[0], lines[0].x1+offsetX )
    // console.log(mouseX , lines[0].x1+offsetX ,mouseY , lines[0].y1+offsetY,"**", mouseX -(lines[0].x1+offsetX))  
    // console.log(lines[0],mouseX ,(lines[0].x1+offsetX),Math.abs(mouseX-(lines[0].x1+offsetX)))
    //console.log(Math.abs(mouseX-(lines[0].x1+offsetX))<5 ,   )
    // console.log(Math.abs(mouseY-(lines[0].y1+mouseY)) ,Math.abs(mouseY-(lines[0].y2+mouseY))   )
    // console.log(mouseY,   lines[0].y1+offsetY,  lines[0].y2+offsetY    )
    // console.log(mouseX,mouseY,      )
    //offsetX+canvasBounding.width, offsetY
    // console.log(offsetX + canvasBounding.width, offsetY, mouseX, mouseY)
    // console.log(Math.abs((offsetX + canvasBounding.width) - mouseX), Math.abs((offsetY) - mouseY))
    if (Math.abs((offsetX + canvasBounding.width) - mouseX) < 3 && Math.abs(offsetY - mouseY) < 3) {
      isDragging = true
      currentLineType = canvasType.gridLines
      console.log("鼠标按下：外点")
    }


    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const { x1, y1, x2, y2 } = line;

      // if (y1 === y2) {
      //   if ((Math.abs(mouseY - (line.y1 + offsetY)) < 3) && (mouseX >= line.x1 + offsetX && offsetX <= line.x2 + offsetX)) {
      //     console.log(mouseX, "鼠标按下：点", i)
      //     // console.log(lines[0], lines[1], currentMouseDownPoint)
      //     if (mouseX < (canvas.width / 2)) {
      //       console.log("左")
      //       currentMouseDownXYLine = {x: 0, y:i}
      //     } else {
      //       console.log("右")
      //       currentMouseDownXYLine = {x: 1, y:i}
      //     }

      //     selectedLineIndex = i
      //     isDragging = true
      //     currentLineType = canvasType.points
      //   }
      // }


      if (x1 === x2) {
        if ((Math.abs(mouseX - (line.x1 + offsetX)) < 3) && (mouseY >= line.y1 + offsetY && mouseY <= line.y2 + offsetY)) {
          currentLineType = canvasType.verticalLines
          selectedLineIndex = i
          isDragging = true
          console.log(line, "鼠标按下：竖线")
        }
      } else if (y1 === y2) {
        if ((Math.abs(mouseY - (line.y1 + offsetY)) < 3) && (mouseX >= line.x1 + offsetX && offsetX <= line.x2 + offsetX)) {
          if (currentLineType == canvasType.verticalLines) {
            console.log(line, "鼠标按下：点")
            if (Math.abs((lines[0].x1 + offsetX) - mouseX) < 10) {
              console.log("左", i)
              currentMouseDownXYLine = { x: 0, y: i }
            } else {
              console.log("右", i)
              currentMouseDownXYLine = { x: 1, y: i }
            }

            selectedLineIndex = i
            isDragging = true
            currentLineType = canvasType.points
          } else {
            selectedLineIndex = i
            isDragging = true
            currentLineType = canvasType.horizontalLines
            console.log(line, "鼠标按下：横线")
          }
        }
      } else {
        currentLineType = canvasType.regions
      }
    }

    selectedLineType = currentLineType
  };

  const handleMouseMove = (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    if (isDragging && (Math.abs(mouseX - currentMouseDownPoint.mouseX) >= 1 || Math.abs(mouseY - currentMouseDownPoint.mouseY) >= 1)) {

      const [offsetX, offsetY] = [(canvas.width / 2 - canvasBounding.width / 2), (canvas.height / 2 - canvasBounding.height / 2)];
      localStorage.setItem('offsetX', (canvas.width / 2 - canvasBounding.width / 2));
      localStorage.setItem('offsetY', (canvas.height / 2 - canvasBounding.height / 2));

      if (selectedLineType === canvasType.gridLines) {
        //横轴拉动 && 最小值不小于60px
        if ((mouseX > currentMouseDownPoint.mouseX || mouseX < currentMouseDownPoint.mouseX) && mouseX - canvas.width / 2 > 30 && canvas.width - mouseX > 20) {
          canvasBounding.width = JSON.parse(JSON.stringify(parseInt(canvas.width - (canvas.width - mouseX) * 2)))
          canvasOffsetX = parseInt((canvas.width - canvasBounding.width) / 2)
          localStorage.setItem('canvasBounding', JSON.stringify(canvasBounding));

        }
        //纵轴拉动  && 最小值不小于100px
        if ((mouseY > currentMouseDownPoint.mouseY || mouseY < currentMouseDownPoint.mouseY) && canvas.height / 2 - mouseY > 50 && mouseY > 20) {
          canvasBounding.height = JSON.parse(JSON.stringify(parseInt(canvas.height - mouseY * 2)))
          canvasOffsetY = parseInt((canvas.height - canvasBounding.height) / 2)
          localStorage.setItem('canvasBounding', JSON.stringify(canvasBounding));
        }


        let h1 = parseFloat((canvasBounding.width / 3).toFixed(1))
        let h2 = parseFloat((h1 * 2).toFixed(1))
        let h3 = parseFloat((canvasBounding.width).toFixed(1))
        let v1 = parseFloat((canvasBounding.height / 5).toFixed(1))
        let v2 = parseFloat((v1 * 2).toFixed(1))
        let v3 = parseFloat((v1 * 3).toFixed(1))
        let v4 = parseFloat((v1 * 4).toFixed(1))
        let v5 = parseFloat((canvasBounding.height).toFixed(1))

        ctx.lineWidth = 2

        ctx.beginPath()

        localStorage.setItem('lines', JSON.stringify([
          { x1: h1, y1: 0, x2: h1, y2: v5 }, // 横1
          { x1: h2, y1: 0, x2: h2, y2: v5 }, // 横2
          { x1: 0, y1: v1, x2: h3, y2: v1 }, // 竖1
          { x1: 0, y1: v2, x2: h3, y2: v2 }, // 竖2
          { x1: 0, y1: v3, x2: h3, y2: v3 }, // 竖3
          { x1: 0, y1: v4, x2: h3, y2: v4 }, // 竖4
        ]));

        lines = [
          { x1: h1, y1: 0, x2: h1, y2: v5 }, // 横1
          { x1: h2, y1: 0, x2: h2, y2: v5 }, // 横2
          { x1: 0, y1: v1, x2: h3, y2: v1 }, // 竖1
          { x1: 0, y1: v2, x2: h3, y2: v2 }, // 竖2
          { x1: 0, y1: v3, x2: h3, y2: v3 }, // 竖3
          { x1: 0, y1: v4, x2: h3, y2: v4 }, // 竖4
        ]

        draw()
        console.log("鼠标移动-外点")
      }

      if (selectedLineIndex >= 0) {
        // 更新被选中线的位置
        if (selectedLineIndex < lines.length) {
          if (selectedLineType === canvasType.points) {
            // console.log(mouseX, mouseY, lines[currentMouseDownXYLine.x], lines[currentMouseDownXYLine.y])
            console.log("鼠标移动-点", currentMouseDownXYLine.y)
            let flag = false
            // 判断X轴条件
            if (currentMouseDownXYLine.x == 0 && (mouseX - offsetX > 20) && (mouseX - offsetX < canvasBounding.width - 40) && (mouseX - offsetX <= lines[1].x1 - 20)) {

              console.log("左侧点，不超出边框")

              //判断Y轴条件
              if (currentMouseDownXYLine.y == 2 && mouseY - offsetY >= 20 && (lines[currentMouseDownXYLine.y + 1].y1 + offsetY >= (mouseY) + 20)) {
                flag = true;
              }
              if ((currentMouseDownXYLine.y == 3 || currentMouseDownXYLine.y == 4) && (lines[currentMouseDownXYLine.y - 1].y1 + offsetY <= (mouseY) - 20) && (lines[currentMouseDownXYLine.y + 1].y1 + offsetY >= (mouseY) + 20)) {
                flag = true;
              }
              if (currentMouseDownXYLine.y == 5 && (lines[currentMouseDownXYLine.y - 1].y1 + offsetY <= (mouseY) - 20) && mouseY - offsetY <= canvasBounding.height - 20) {
                flag = true;
              }

              if (flag) {
                lines[currentMouseDownXYLine.x].x1 = mouseX - offsetX
                lines[currentMouseDownXYLine.x].x2 = mouseX - offsetX
                lines[currentMouseDownXYLine.y].y1 = mouseY - offsetY
                lines[currentMouseDownXYLine.y].y2 = mouseY - offsetY
                localStorage.setItem('lines', JSON.stringify(lines));

                draw()
              }

            } else if (currentMouseDownXYLine.x == 1 && (mouseX - offsetX > 40) && (mouseX - offsetX < canvasBounding.width - 20) && (mouseX - offsetX >= lines[0].x1 + 20)) {
              console.log("右侧点-不超过边框宽度")
              if (currentMouseDownXYLine.y == 2 && mouseY - offsetY >= 20 && (lines[currentMouseDownXYLine.y + 1].y1 + offsetY >= (mouseY) + 20)) {
                flag = true;
              }
              if ((currentMouseDownXYLine.y == 3 || currentMouseDownXYLine.y == 4) && (lines[currentMouseDownXYLine.y - 1].y1 + offsetY <= (mouseY) - 20) && (lines[currentMouseDownXYLine.y + 1].y1 + offsetY >= (mouseY) + 20)) {
                flag = true;
              }
              if (currentMouseDownXYLine.y == 5 && (lines[currentMouseDownXYLine.y - 1].y1 + offsetY <= (mouseY) - 20) && mouseY - offsetY <= canvasBounding.height - 20) {
                flag = true;
              }

              if (flag) {
                lines[currentMouseDownXYLine.x].x1 = mouseX - offsetX
                lines[currentMouseDownXYLine.x].x2 = mouseX - offsetX
                lines[currentMouseDownXYLine.y].y1 = mouseY - offsetY
                lines[currentMouseDownXYLine.y].y2 = mouseY - offsetY
                localStorage.setItem('lines', JSON.stringify(lines));
                draw()
              }
            }
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    selectedLineIndex = -1;
    isDragging = false;
   
    canvasDrawData()

  };




  // const downloadFile = () => {
  //   const handleDownload = () => {
  //     fetch('http://localhost:5000/download')
  //       .then((response) => {
  //         response.blob().then((blob) => {
  //           const url = window.URL.createObjectURL(blob);
  //           const link = document.createElement('a');
  //           link.href = url;
  //           link.setAttribute('download', 'folder.zip');
  //           document.body.appendChild(link);
  //           link.click();
  //           document.body.removeChild(link);
  //         });
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error);
  //       });
  //   };

  //   return (
  //     <div>
  //       <Button type="primary" onClick={handleDownload}>
  //         Download Folder
  //       </Button>
  //     </div>
  //   );
  // };


  return (

    <div className='flex-wrapper'>
      {contextHolder}



      <div className="page-wrapper">



        <div className="left-block">
          <div className="draw-title">Drag the control points below <br /> to create your font </div>
          <div id="canvas-container">
            <canvas id="myCanvas" ref={canvasRef} width="400" height="474"></canvas>
          </div>

          <div id="operation">
            <div className='page-switch-block'>
              <div className={isDomTypeActive ? 'active' : ''} onClick={() => IsTypeActiveClick(true)}>Type Tester</div>
              <div className={!isDomTypeActive ? 'active' : ''} onClick={() => IsTypeActiveClick(false)} >About</div>
            </div>

            <div className='grid-switch-block'>
              <div className={isGridActive ? 'active' : ''} onClick={() => IsGridActiveClick(true)} >Show Grid</div>
              <div className={!isGridActive ? 'active' : ''} onClick={() => IsGridActiveClick(false)}>Hide Grid</div>
            </div>

            <div className='switch-block'>
              <span>Font Size: </span>
              <Slider className='font-size-slider my_slider' handleColor="black" trackHoverBg="black" trackBg="black" defaultValue={1} min={0.1} max={2} step={0.1} onAfterChange={onFontSizeChange} /></div>
            <div className='switch-block'><span>spacing: </span><Slider className='font-size-slider my_slider' defaultValue={20} min={0} max={300} onAfterChange={(v) => handleSpaceChange(v)} /></div>
            <div className='switch-block'><span>line height: </span><Slider className='font-size-slider my_slider ' defaultValue={20} min={0} max={500} onAfterChange={(v) => dispatch(setLineValue(v))} /></div>


            <div className='other-block'>
              <div className='color-list'>
                <div style={{ backgroundColor: "black" }} onClick={() => dispatch(setColorValue("black"))}></div>
                <div style={{ backgroundColor: "blue" }} onClick={() => dispatch(setColorValue("blue"))}></div>
                <div style={{ backgroundColor: "yellow" }} onClick={() => dispatch(setColorValue("yellow"))}></div>
                <div style={{ backgroundColor: "red" }} onClick={() => dispatch(setColorValue("red"))}></div>
                <div style={{ backgroundColor: "green" }} onClick={() => dispatch(setColorValue("green"))}></div>
              </div>
              <div className='align-list'>
                <div name='left' onClick={() => dispatch(setAlignValue("left"))}>
                  <img style={{ display: alignValue === "left" ? "block" : "none" }} src={iconAlignLeftActive} alt="Align Left Active" />
                  <img style={{ display: alignValue === "left" ? "none" : "block" }} src={iconAlignLeft} alt="Align Left" /></div>
                <div name='center' onClick={() => dispatch(setAlignValue("center"))}>
                  <img style={{ display: alignValue === "center" ? "block" : "none" }} src={iconAlignCenterActive} alt="Align Center Active" />
                  <img style={{ display: alignValue === "center" ? "none" : "block" }} src={iconAlignCenter} alt="Align Center" /></div>
                <div name='right' onClick={() => dispatch(setAlignValue("right"))}>
                  <img style={{ display: alignValue === "right" ? "block" : "none" }} src={iconAlignRightActive} alt="Align Right Active" />
                  <img style={{ display: alignValue === "right" ? "none" : "block" }} src={iconAlignRight} alt="Align Right" /></div>
              </div>

              <div className='middle-list'>
                <div name='middle' onClick={() => dispatch(setMiddleValue(!middleValue))}>
                  <img style={{ display: middleValue ? "block" : "none" }} src={iconAlignMiddleActive} alt="Align Middle Active" />
                  <img style={{ display: middleValue ? "none" : "block" }} src={iconAlignMiddle} alt="Align Middle" /></div>
              </div>
            </div>

            <div className='download-block' onClick={() => downloadClick()}>Download & Archive Font</div>

            <div className='archive-block' onClick={() => browseArchiveClick()}>Browse Archive</div>


          </div>

        </div>
  
          <div ref={targetRef} className="right-block">
            <Spin spinning={loading} tip="Loading" size="large" delay={500}> 
            <div id="letter_block"></div>
            <div id="number_block"></div>
            <div id="symbol_block"></div>
            <div id="about_block"></div>
            <div id="author_block"></div>

            </Spin>
          </div>
     
      </div>

      
      <div className='Archive-wrapper'>
      <Spin spinning={fontLoading} tip="Loading" size="large"> </Spin>

        <div className='Archive-block'>
        <div className='back-block' onClick={() => back()}><img style={{height: "80px",  width: "80px"}} src={iconBack}></img></div>
      
        <div className='right-font-list' id='rightFontList'>
       
        </div>
        </div>
       
      </div>










      <div className='hide-canvas-block' style={{ display: "none" }}>
        <canvas id="hideCanvas" ref={canvasHideRef} width="800" height="474"></canvas>
      </div>
      <div className='temp-canvas-block' style={{ display: "none" }}>
        <canvas id="tempCanvas" ref={canvasTempRef} width="800" height="474"></canvas>
      </div>
    </div>
  );
};

export default Home;
