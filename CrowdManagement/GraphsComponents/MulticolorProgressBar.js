import React from 'react'
import './MulticolorProgressBar.scss'

const MulticolorProgressBar = (props) => {
     let readings = [
          {
               name: 'Apples',
               value: 30,
               color: '#F1F0F0'
          },
          {
               name: 'Blueberries',
               value: 30,
               color: '#F1F0F0'
          },
          {
               name: 'Guavas',
               value: 30,
               color: 'red'
          },

     ];
     const parent = props;
     let bars = parent.readings && parent.readings.length && parent.readings.map(function (item, i) {
          if (item.value > 0) {
               return (
                    <div className="bar" style={{ 'backgroundColor': item.color, 'width': item.value + '%' }} key={i}>

                    </div>
               )
          }
     }, this);
     return (
          <div className="multicolor-bar">

               <div className="bars">
                    {bars == '' ? '' : bars}
               </div>
          </div>
     )
}

export default MulticolorProgressBar