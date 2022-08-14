import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

export interface ITeam {
  id: number
  name: string
  picked: boolean
}

export interface ITableItem {
  teamId: number | null
}

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })
  useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('drag', updateMousePosition)
    return () => {
      window.removeEventListener('drag', updateMousePosition)
    }
  }, [])
  return mousePosition
}

const HomePage: NextPage = () => {
  // Team data and hooks
  const [teams, updateTeams] = useState<ITeam[]>([
    { id: 0, name: 'Tottenham Hotspurs', picked: false },
    { id: 1, name: 'Chelsea FC', picked: false },
    { id: 2, name: 'Manchester City', picked: false },
    { id: 3, name: 'Plymouth Argyle', picked: false },
  ])

  const [tablePos, setTablePos] = useState<ITableItem[]>([
    { teamId: null },
    { teamId: null },
    { teamId: null },
    { teamId: null },
  ])

  // Drag hooks
  const [currentDrag, setCurrentDrag] = useState(null)
  const [currentDragOver, setCurrentDragOver] = useState<
    number | 'teams' | null
  >(null)

  // Current mouse position when dragging
  const mousePosition = useMousePosition()

  // I'm setting current drag as the row index
  const dragEntered = (e: React.DragEvent, teamIndex: number) => {
    e.preventDefault()
    console.log('DRAGGING:', teamIndex)
    setCurrentDrag(teamIndex)
  }

  const dragEnd = (e: React.DragEvent, index: any) => {
    console.log('ENDING DRAG:', index)
    // Set the table
    console.log(currentDrag, currentDragOver)
    const toTable = currentDragOver === 'teams' ? false : true
    updateTable(index, toTable)

    setCurrentDrag(null)
  }

  const dragLeave = (e: React.DragEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    target.classList.remove('border-b-red-500')
    target.classList.remove('border-t-red-500')
    target.classList.remove('bg-red-500')
  }

  const dragOver = (e: React.DragEvent<HTMLElement>, index: number) => {
    const target = e.target as HTMLElement

    if (currentDragOver !== index) setCurrentDragOver(index)

    if (currentDrag && target && mousePosition.y && index) {
      if (tablePos[index].teamId) {
        const halfOfHeight = target.offsetHeight / 2
        if (mousePosition.y < target?.offsetTop + halfOfHeight) {
          target.classList.remove('border-b-red-500')
          target.classList.add('border-t-red-500')
        } else if (mousePosition.y > target?.offsetTop + halfOfHeight) {
          target.classList.remove('border-t-red-500')
          target.classList.add('border-b-red-500')
        }
      } else {
        target.classList.add('bg-red-500')
      }
    }
  }

  const dragLeaveTeam = (e: React.DragEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    target.classList.remove('border-b-red-500')
    target.classList.remove('border-t-red-500')
  }

  const dragEndTeam = (e: React.DragEvent, teamIndex: any) => {
    // Set the table
    if (currentDragOver !== null && currentDragOver !== 'teams') {
      updateTable(teamIndex, true)
    }

    setCurrentDrag(null)
  }

  const dragOverTeamBox = (e: React.DragEvent) => {
    setCurrentDragOver('teams')
  }

  const updateTable = (index: number, toTable: boolean) => {
    console.log('UPDATE TABLE')
    const updatedTable = [...tablePos]
    const rowIndex = toTable ? currentDragOver : currentDrag

    updatedTable[rowIndex] = { teamId: toTable ? index : null }
    setTablePos(updatedTable)

    // Adjust what teams have been picked
    const pickedTeams = [...teams]
    pickedTeams[index].picked = toTable ? true : false
    updateTeams(pickedTeams)
  }

  return (
    <div className="flex flex-col w-screen justify-center items-center px-20">
      <h3>Predictionary</h3>
      <table className="rounded-lg border border-gray-500 py-4 bg-gray-100 w-full">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {tablePos.map((tableItem, rowIndex) => {
            console.log(tableItem.teamId)
            // const teamIndex = tableItem.team ? teams[tableItem.team] : null

            return (
              <tr
                className={clsx(
                  'bg-slate-100 hover:bg-slate-100',
                  'w-full px-4 py-12 border-t border-b'
                )}
                draggable={tableItem.teamId !== null}
                key={rowIndex}
                onDragOver={(e) => dragOver(e, rowIndex)}
                onDragLeave={(e) => dragLeave(e)}
                onDragEnd={(e) => dragEnd(e, teams[tableItem.teamId].id)}
                onDrag={(e) =>
                  dragEntered(e, rowIndex, teams[tableItem.teamId].id)
                }
              >
                <td>{rowIndex + 1}</td>
                <td>
                  {tableItem.teamId !== null
                    ? teams[tableItem.teamId].name
                    : ''}
                </td>
                <td></td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div
        className="bg-red-500 min-w-full mt-10 px-8 py-8"
        draggable={false}
        onDragOver={(e) => dragOverTeamBox(e)}
      >
        <h5>Teams</h5>
        <div className="rounded-lg grid grid-cols-2 gap-2 mt-4 w-full">
          {teams.map((item, index) => {
            return !item.picked ? (
              <div
                className="bg-gray-100"
                key={item.name}
                draggable={true}
                onDragLeave={(e) => dragLeaveTeam(e)}
                onDrag={(e) => dragEntered(e, index)}
                onDragEnd={(e) => dragEndTeam(e, index)}
              >
                {item.name}
              </div>
            ) : (
              <div key={index}></div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HomePage
