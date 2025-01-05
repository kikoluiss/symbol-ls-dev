'use strict'

import { Flex, Link, Box, H4 } from 'smbls'

const gridRows = 10;
const gridCols = 20;

const Button = {
  tag: 'button',
  props: {
    width: '26px',
    height: '26px',
    border: '0px',
    borderRadius: '6px'
  },
}

export const GridButton = {
  extend: Button,
  props: (element, state) => {
    const selRow = element.lookup("GridColumn").props.row;
    const selCol = element.props.col;
    return {
      background: state.activeMatrix && state.activeMatrix[selRow] && state.activeMatrix[selRow][selCol] ? '#3D7BD9' : '#E8F1FF',
    }
  },
  on: {
    click: (event, element, state, context) => {
      const selRow = element.lookup("GridColumn").props.row;
      const selCol = element.lookup("GridButton").props.col;

      const activeMatrix = new Array(state.rows).fill().map(() => new Array(state.cols).fill(false));

      for (let i = 0; i <= selRow; i++) {
        for (let j = 0; j <= selCol; j++) {
          activeMatrix[i][j] = true;
        }
      }

      state.update({
        selRow: selRow + 1,
        selCol: selCol + 1,
        activeMatrix: activeMatrix
      })
    },
  }
}

const Column = {
}

const makeCols = (n) => {
  const cols = [];
  for (let i = 0; i < n; i++) {
    cols.push({ GridButton: {col: i}});
  }
  return cols;
}

export const GridColumn = {
  props: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  },
  childExtend: Column,
  ...makeCols(gridCols)
}

const Row = {
}

const makeRows = (n) => {
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({ GridColumn: {row: i} });
  }
  return rows;
}

export const GridRow = {
  props: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: "10px",
    background: 'white',
    borderRadius: '10px'
  },
  childExtend: Row,
  ...makeRows(gridRows)
}

export const GridBox = {
  state: {
    rows: gridRows,
    cols: gridCols,
    selRow: 0,
    selCol: 0,
    activeMatrix: new Array(gridRows).fill().map(() => new Array(gridCols).fill(false))
  },
  onInit: (element, state) => {
    console.log(state)
  },
  extend: Box,
  props: {
    background: '#EBEBEB',
    padding: "20px, 26px",
    borderRadius: "16px"
  },
  TitleBar: {
    extend: H4,
    props: {
      padding: '10px 0px'
    },
    text: 'Grid Selection'
  },
  GridRow,
  InfoBar: {
    extends: Flex,
    props: {
      minWidth: '100%',
      padding: '10px 0px',
    },
    Flex: {
      props: { 
        justifyContent: 'space-between' 
      },
      Text_Coordinates: { text: (element, state) => `Selection coordinates: ${state.selRow}, ${state.selCol}` },
      Text_Selected: { text: (element, state) => `Total cells selected: ${state.selRow * state.selCol}` }
    }
  }
}

export const Header = {
  extend: Flex,
  props: {
    minWidth: '100%',
    padding: 'Z B',
    align: 'center space-between'
  },

  Flex: {
    props: { gap: 'C' },
    childExtend: {
      extend: Link,
      props: ({ props }) => ({
        textDecoration: window.location.pathname === props.href ? 'underline' : 'none'
      })
    },
    Text_grid: { href: '/', text: 'Grid Selection' }
  },
}

export const Footer = {
  props: {
    padding: 'Z B',
    order: 9
  }
}
