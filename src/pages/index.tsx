import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx';

export interface ITeam { 
  name: string,
}

const useMousePosition = () => {
  const [
    mousePosition,
    setMousePosition
  ] = useState({ x: null, y: null });
    useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('drag', updateMousePosition);
    return () => {
      window.removeEventListener('drag', updateMousePosition);
    };
  }, []);
  return mousePosition;
};

const HomePage: NextPage = () =>  {
  // Team data and hooks
  const teams: ITeam[] = [{ name: 'Tottenham Hotspurs'}, { name: 'Chelsea FC'}, { name: 'Manchester City'}, { name: 'Plymouth Argyle'}]
  const [pickedTeam, setPickTeam] = useState([false, false, false, false])
  const [tablePos, setTablePos] = useState([{team: null}, {team: null}, {team: null}, { team: null }])

  // Drag hooks
  const [currentDrag, setCurrentDrag] = useState({ type: 'team', id: false})
  const [currentDragOver, setCurrentDragOver] = useState(null)
  const [dragActive, setActiveDrag] = useState(false)
  
  // Current mouse position when dragging
  const mousePosition = useMousePosition();
  
  const dragEntered = (e: DragEvent, index: any) => { 
    e.preventDefault()
    if (!dragActive) {
      setCurrentDrag(index)
      setActiveDrag(true)
    }
  }

  const dragEnd = () => { 
    console.log('EXIT')
    setActiveDrag(false)
    setCurrentDrag(null)
  }

  
  const dragLeave = (e: DragEvent) => { 
    e.target.classList.remove('border-b-red-500')
    e.target.classList.remove('border-t-red-500')
    e.target.classList.remove('bg-red-500')

  }
  
  const dragOver = (e: DragEvent, index: any) => { 
    console.log('SETTING DRAG OVER')
    setCurrentDragOver(index)
    if (dragActive) {
      if (tablePos[index].team)  {
          const halfOfHeight = e.target.offsetHeight / 2
          if (mousePosition.y < (e.target?.offsetTop + halfOfHeight)) {
            e.target.classList.remove('border-b-red-500')
            e.target.classList.add('border-t-red-500')
          }
          else if (mousePosition.y > (e.target?.offsetTop + halfOfHeight)) {
            e.target.classList.remove('border-t-red-500')
            e.target.classList.add('border-b-red-500')
          }
      } else {
        e.target.classList.add('bg-red-500')
      }
    }
  }

  // SECOND LOT DRAG
  
  const dragLeaveTeam = (e: DragEvent) => { 
    e.target.classList.remove('border-b-red-500')
    e.target.classList.remove('border-t-red-500')
  }

  // const dragDropTeam = (e: DragEvent, index: any) => { 
  //   if (currentDragOver) { 
  //     let newTeam = [ ...tablePos ]
  //     newTeam = [currentDragOver].team = index
  //     setTablePos(newTeam)
  //     console.log(tablePos)
  //   }
  // }


  const dragEnteredTeam = (e: DragEvent, index: any) => { 
    e.preventDefault()
    if (!dragActive) {
      setCurrentDrag(index)
      setActiveDrag(true)
    }
  }

  const dragEndTeam = (e: DragEvent, index: any) => { 
    console.log('EXIT')
    console.log(currentDragOver , index)
    
    if ( currentDragOver !== null) {
      console.log('SETTING TABLE POSITION')
      // Set the table
      const updatedTable = [ ...tablePos ]
      updatedTable[currentDragOver] = { team: index }
      setTablePos(updatedTable)
      
      // Adjust what teams have been picked
      const updatedPicks= [ ...pickedTeam ]
      updatedPicks[index] = true
      setPickTeam(updatedPicks)
    }

    setActiveDrag(false)
    setCurrentDrag(null)
  }

  return (  
    <div className='flex flex-col w-screen justify-center items-center px-20'>
      <h3>Predictionary</h3>
      <table className='rounded-lg border border-gray-500 py-4 bg-gray-100 w-full'>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>{ tablePos.map((item, index) => { 
          console.log(item)
          return (
            <tr
              className={clsx(dragActive && index === currentDrag.id && currentDrag.type !== 'team' ? 'bg-gray-200 text-gray-400' : 'bg-slate-100 hover:bg-slate-100', 'w-full px-4 py-12 border-t border-b')}
              draggable="true"
              key={index}
              onDragOver={(e) => dragOver(e, index)}
              onDragLeave={(e) => dragLeave(e)}
              onDragEnter={(e) => dragEntered(e, index)}
              onDragEnd={(e) => dragEnd()}
              // onDrop={(e) => console.log('DROP', item.name, index)}
              // onDrag={(e) => console.log('DRAG', item.name, index)}
            > 
        
              <td>{ index + 1 }</td>
              <td>{item.team !== null ? teams[item.team].name : ''}</td>
              <td>{ item.team } </td>
            </tr>
          )
        })}
        </tbody>
      </table>
      
      <h5 className='mt-10'>Teams</h5>
      <div className='rounded-lg pa-10 grid grid-cols-2 gap-2 mt-4'>
        { teams.map((item, index) => {
          return !pickedTeam[index] ? (
            <div 
              className='bg-gray-100' 
              key={item.name}
              draggable={true}
              onDragLeave={(e) => dragLeaveTeam(e)}
              onDragEnter={(e) => dragEnteredTeam(e, index)}
              onDragEnd={(e) => dragEndTeam(e, index)}
            >
                { item.name }
            </div>
          ) : ''
        })}
      </div>
    </div>
  )
}

export default HomePage