import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

export interface ITeam {
  id: number
  name: string
  picked: boolean
}

const HomePage: NextPage = () => {
  // Team data and hooks
  const [teams, updateTeams] = useState<ITeam[]>([
    { id: 0, name: 'Tottenham Hotspurs', picked: false },
    { id: 1, name: 'Chelsea FC', picked: false },
    { id: 2, name: 'Manchester City', picked: false },
    { id: 3, name: 'Arsenal FC', picked: false },
    { id: 4, name: 'Liverpool FC', picked: false },
    { id: 5, name: 'Brighton Albion FC', picked: false },
    { id: 6, name: 'Leeds United', picked: false },
    { id: 7, name: 'Newcastle', picked: false },
    { id: 8, name: 'Manchester United', picked: false },
    { id: 9, name: 'Brentford', picked: false },
    { id: 10, name: 'Fulham', picked: false },
    { id: 11, name: 'Nottingham Forest', picked: false },
    { id: 12, name: 'Crystal Palace', picked: false },
    { id: 13, name: 'Southampton', picked: false },
    { id: 14, name: 'Aston Villa', picked: false },
    { id: 15, name: 'Bournemouth', picked: false },
    { id: 16, name: 'Everton', picked: false },
    { id: 17, name: 'Leicester City', picked: false },
    { id: 18, name: 'West Ham United', picked: false },
    { id: 19, name: 'Wolverhampton FC', picked: false },
  ])

  const [tablePos, setTablePos] = useState<Number[] | null[]>([])

  // Drag hooks
  const [currentDrag, setCurrentDrag] = useState<Number | null>(null)
  const [currentDragOver, setCurrentDragOver] = useState<
    number | 'teamSection' | null
  >(null)

  // Create table array
  useEffect(() => {
    const createTable = []
    for (let i = 0; i < teams.length; i++) {
      createTable.push(null)
    }
    setTablePos(createTable)
  }, [])

  const dragEntered = (e: React.DragEvent, teamId: number) => {
    e.preventDefault()
    console.log('DRAGGING:', teamId)
    setCurrentDrag(teamId)
  }

  const dragEnd = (e: React.DragEvent, teamId: any, currentTeamRow: number) => {
    console.log('ENDING DRAG:', teamId)
    // Set the table
    console.log(currentDrag, currentDragOver)
    const toTable = currentDragOver === 'teamSection' ? false : true
    updateTable(teamId, toTable, currentTeamRow)

    setCurrentDrag(null)
  }

  const dragLeave = (e: React.DragEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    target.classList.remove('bg-blue-200')
  }

  const dragOver = (e: React.DragEvent<HTMLElement>, rowIndex: number) => {
    const target = e.target as HTMLElement
    console.log('current drag over:', rowIndex)

    if (currentDragOver !== rowIndex) setCurrentDragOver(rowIndex)

    target.classList.add('bg-blue-200')
  }

  const updateTable = (
    teamId: number,
    toTable: boolean,
    currentTeamRow?: number
  ) => {
    const table = [...tablePos]

    const nextTeamRow = toTable ? currentDragOver : currentDrag
    console.log('CURRENT DRAGGED TEAM ROW', currentTeamRow, nextTeamRow)
    // If hovered row is occupied with a team, move hovered item to other row
    console.log(table[nextTeamRow])
    if (table[nextTeamRow] || table[nextTeamRow] === 0) {
      console.log('IS OCCUPIED BY', table[nextTeamRow])

      // Is the currentDrag picked, swap rows if not
      if (!teams[currentDrag].picked) {
        console.log('CURRENT DRAG IS NOT PICKED', teams[currentDrag].picked)
        teams[table[nextTeamRow]].picked = false
        table[nextTeamRow] = null
      } else if (currentTeamRow || currentTeamRow === 0) {
        console.log('SHOULD SWAP ROWS')
        table[currentTeamRow] = table[nextTeamRow] // get current position of the dragged item
        table[nextTeamRow] = null
      }
    } else {
      table[currentTeamRow] = null
    }

    table[nextTeamRow] = toTable ? teamId : null
    setTablePos(table)

    // Adjust what teams have been picked
    const pickedTeams = [...teams]
    pickedTeams[teamId].picked = toTable ? true : false
    updateTeams(pickedTeams)
    console.log('UPDATE TABLE', table)
  }

  const dragEndTeam = (e: React.DragEvent, teamIndex: any) => {
    // Set the table
    if (currentDragOver !== null && currentDragOver !== 'teamSection') {
      updateTable(teamIndex, true)
    }

    setCurrentDrag(null)
  }

  const dragOverTeamBox = (e: React.DragEvent) => {
    setCurrentDragOver('teamSection')
  }

  return (
    <div className="flex flex-col w-screen-1/2 justify-center items-center px-20">
      <h3 className="font-medium text-3xl py-20">Predictionary</h3>
      <div className="grid grid-cols-6 w-full gap-6">
        {/* Table  */}
        <div className="border-separate border-spacing-2 bg-gray-100 rounded-lg py-12  w-full px-12 col-span-4">
          {tablePos.map((teamId, rowIndex) => {
            // console.log(tableItem.teamId)
            // const teamIndex = tableItem.team ? teams[tableItem.team] : null
            return (
              <div className={clsx('w-full flex flex-row')} key={rowIndex}>
                <div className="rounded-md py-2 w-1/12 mr-8">
                  <p className="font-medium text-xl text-center bg-transparent">
                    {rowIndex + 1}
                  </p>
                </div>
                <div
                  draggable={teamId !== null}
                  onDragOver={(e) => dragOver(e, rowIndex)}
                  onDragLeave={(e) => dragLeave(e)}
                  onDragEnd={(e) => dragEnd(e, teams[teamId].id, rowIndex)}
                  onDrag={(e) => dragEntered(e, rowIndex, teams[teamId].id)}
                  className="border border-gray-300 py-2 px-4 hover:bg-slate-100 w-full"
                >
                  {teamId !== null ? teams[teamId].name : ''}
                </div>
              </div>
            )
          })}
        </div>

        {/* Teams */}
        <div
          className="border border-red min-w-full px-8 py-8 col-span-2"
          draggable={false}
          onDragOver={(e) => dragOverTeamBox(e)}
        >
          <h5>Teams</h5>
          <div className="rounded-lg mt-4 w-full">
            {teams.map((item, index) => {
              return !item.picked ? (
                <div
                  className="bg-gray-100 py-2 px-4 rounded-lg mt-2"
                  key={item.name}
                  draggable={true}
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

      <div className="mt-12">
        <button className="bg-blue-500 px-4 py-2 text-white rounded-lg font-medium hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  )
}

export default HomePage
