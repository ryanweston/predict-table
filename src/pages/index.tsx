import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import Image from 'next/image'
import logo from '../../public/logo2.png'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Head from 'next/head'

export interface ITeam {
  id: number
  name: string
  picked: boolean
  ref: string
}

const Header = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex flex-row items-center">
        <h3 className="font-medium text-2xl border-b-4 border-transparent hover:border-black">
          Register
        </h3>
        <Link href="/api/auth/signin">
          <a className="font-medium text-2xl ml-6 border-b-4 border-transparent hover:border-black">
            Login
          </a>
        </Link>
      </div>
    )
  } else if (!session) {
    return (
      <a className="font-medium text-2xl ml-6 border-b-4 border-transparent hover:border-black">
        {session}
      </a>
    )
  }
}

const HomePage: NextPage = () => {
  const { data: session } = useSession()

  // Team data and hooks
  const [teams, updateTeams] = useState<ITeam[]>([
    {
      id: 0,
      name: 'Tottenham Hotspurs',
      ref: 'tottenham-hotspur',
      picked: false,
    },
    { id: 1, name: 'Chelsea FC', ref: 'chelsea', picked: false },
    { id: 2, name: 'Manchester City', ref: 'manchester-city', picked: false },
    { id: 3, name: 'Arsenal FC', ref: 'arsenal', picked: false },
    { id: 4, name: 'Liverpool FC', ref: 'liverpool', picked: false },
    {
      id: 5,
      name: 'Brighton & Hove Albion FC',
      ref: 'brighton-albion',
      picked: false,
    },
    { id: 6, name: 'Leeds United', ref: 'leeds-united', picked: false },
    { id: 7, name: 'Newcastle United', ref: 'newcastle-united', picked: false },
    {
      id: 8,
      name: 'Manchester United',
      ref: 'manchester-united',
      picked: false,
    },
    { id: 9, name: 'Brentford', ref: 'brentford', picked: false },
    { id: 10, name: 'Fulham', ref: 'fulham', picked: false },
    {
      id: 11,
      name: 'Nottingham Forest',
      ref: 'nottingham-forest',
      picked: false,
    },
    { id: 12, name: 'Crystal Palace', ref: 'crystal-palace', picked: false },
    { id: 13, name: 'Southampton', ref: 'southampton', picked: false },
    { id: 14, name: 'Aston Villa', ref: 'aston-villa', picked: false },
    { id: 15, name: 'AFC Bournemouth', ref: 'afc-bournemouth', picked: false },
    { id: 16, name: 'Everton', ref: 'everton', picked: false },
    { id: 17, name: 'Leicester City', ref: 'leicester-city', picked: false },
    { id: 18, name: 'West Ham United', ref: 'west-ham-united', picked: false },
    { id: 19, name: 'Wolverhampton FC', ref: 'wolverhampton', picked: false },
  ])

  const [tablePos, setTablePos] = useState<(number | null)[]>([])
  const [zonesMap, setZonesMap] = useState(new Map())

  // Drag hooks
  const [currentDrag, setCurrentDrag] = useState<number | null>(null)
  const [currentDragOver, setCurrentDragOver] = useState<
    number | 'teamSection' | null
  >(null)

  // todo: this will come from query when backend is setup
  const highlightedZones = [
    {
      name: 'Champions league',
      startIndex: 0,
      endIndex: 3,
      color: 'bg-green-100',
    },
    {
      name: 'Europa league',
      startIndex: 4,
      endIndex: 5,
      color: 'bg-orange-100',
    },
    {
      name: 'Conference league',
      startIndex: 6,
      endIndex: 6,
      color: 'bg-blue-100',
    },
    {
      name: 'Relegation',
      startIndex: 17,
      endIndex: 19,
      color: 'bg-red-100',
    },
  ]

  const updateZones = (k: number, v: string) => {
    setZonesMap(zonesMap.set(k, v))
  }

  const createTable = () => {
    const createTable = []
    for (let i = 0; i < teams.length; i++) {
      createTable.push(null)
    }
    setTablePos(createTable)
  }

  const createZones = () => {
    highlightedZones.forEach((zone) => {
      for (let i = zone.startIndex; i <= zone.endIndex; i++) {
        updateZones(i, zone.color)
      }
    })
  }

  useEffect(() => {
    createTable()
    createZones()
  }, [])

  const dragEntered = (e: React.DragEvent, teamId: number) => {
    e.preventDefault()
    setCurrentDrag(teamId)
  }

  const dragEnd = (e: React.DragEvent, teamId: any, currentTeamRow: number) => {
    // Set the table
    const toTable = currentDragOver === 'teamSection' ? false : true
    updateTable(teamId, toTable, currentTeamRow)
    setCurrentDrag(null)
  }

  const dragLeave = (e: React.DragEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    target.classList.remove('border-black')
    target.classList.remove('border-t-black')
    target.classList.remove('border-2')
  }

  const dragOver = (e: React.DragEvent<HTMLElement>, rowIndex: number) => {
    const target = e.target as HTMLElement
    if (currentDragOver !== rowIndex) setCurrentDragOver(rowIndex)
    target.classList.add('border-black')
    target.classList.add('border-2')
    target.classList.add('border-t-black')
  }

  // Clean up assertions
  const updateTable = (
    teamId: number,
    toTable: boolean,
    currentTeamRow?: number
  ) => {
    const table = [...tablePos]
    const nextTeamRow = (toTable ? currentDragOver : currentDrag) as number

    // If hovered row is occupied with a team, move hovered item to other row
    if (table[nextTeamRow] || table[nextTeamRow] === 0) {
      // Is the currentDrag is not already picked, set dragged over team to not picked
      if (!teams[currentDrag as number]!.picked && table[nextTeamRow]) {
        teams[table[nextTeamRow]!]!.picked = false
        table[nextTeamRow] = null
      } else if (currentTeamRow || currentTeamRow === 0) {
        // move draggedOver team to prev dragged row
        table[currentTeamRow] = table[nextTeamRow]
        table[nextTeamRow] = null
      }
    } else {
      if (currentTeamRow) table[currentTeamRow] = null
    }

    table[nextTeamRow] = toTable ? teamId : null
    setTablePos(table)

    // Adjust what teams have been picked
    const pickedTeams = [...teams]
    pickedTeams[teamId]!.picked = toTable ? true : false
    updateTeams(pickedTeams)
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

  const dragLeaveTeamBox = (e: React.DragEvent) => {
    setCurrentDragOver(null)
  }

  // TODO: save to local storage so it preserves state on refresh

  const onSubmit = () => {
    // check if every position/table row is filled.
    // send to server
    // verify the submission on server
  }

  return (
    <div className="w-screen">
      <div className="w-full px-20 py-10 flex flex-row justify-between items-center">
        <h3 className="font-medium text-2xl">
          <Image src={logo} />
          Predictable
        </h3>
        <div className="flex flex-row items-center">
          <h3 className="font-medium text-2xl border-b-4 border-black hover:border-b-4 hover:border-black">
            Your table
          </h3>
          <h3 className="font-medium ml-6 text-2xl border-b-4 border-transparent hover:border-black">
            Compare with friends
          </h3>
        </div>
        <Header />
      </div>

      <div className="w-full px-20 flex flex-row pt-16 pb-8">
        <h3 className="font-medium text-8xl max-w-4xl">
          Predict your 2022/23 Premier League table
          {/* <Icon
            path={mdiArrowRight}
            color="black"
            size={5}
            className="inline-block"
          /> */}
        </h3>
      </div>

      <div className="flex flex-col w-screen-1/2 px-20 py-12">
        <div className="flex flex-row mb-8">
          Key:
          {highlightedZones.map((zone) => {
            return (
              <div className="flex flex-row ml-4">
                <span className={`px-2 py-1 ${zone.color}`}></span>
                <span className="ml-2">{zone.name}</span>
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-6 w-full gap-10">
          {/* Table  */}
          <div className="border-separate border-spacing-2 w-full col-span-4">
            {tablePos.map((teamId, rowIndex) => {
              let color = null
              if (zonesMap.has(rowIndex)) color = zonesMap.get(rowIndex)
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
                    onDragEnd={(e) =>
                      dragEnd(e, teams[teamId as number]!.id, rowIndex)
                    }
                    onDrag={(e) => dragEntered(e, teams[teamId as number]!.id)}
                    className={clsx(
                      rowIndex > 0 ? 'border-t-transparent' : 'rounded-t-lg',
                      rowIndex === 19 ? 'rounded-b-lg' : '', // fix this to tablePos length
                      color ? color : '',
                      'border border-gray-300 py-2 px-4 hover:bg-zinc-100 w-full flex flex-row items-center',
                      teamId ? 'hover:cursor-pointer' : ''
                    )}
                  >
                    <Image
                      src={'/teams/' + teams[teamId]?.ref + '.png'}
                      width={25}
                      height={25}
                    />
                    {teamId !== null ? teams[teamId]?.name : ''}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Teams */}
          <div
            className={clsx(
              'min-w-full col-span-2',
              currentDragOver === 'teamSection' ? 'border-2 border-black' : ''
            )}
            draggable={false}
            onDragOver={(e) => dragOverTeamBox(e)}
            onDragLeave={(e) => dragLeaveTeamBox(e)}
          >
            <div className="rounded-lg w-full grid grid-cols-2 xl:grid-cols-3 gap-3">
              {teams.map((item, index) => {
                return !item.picked ? (
                  <div
                    className=" text-white py-4 px-4 rounded-lg flex justify-center hover:bg-gray-100 hover:cursor-pointer"
                    key={item.name}
                    draggable={true}
                    onDrag={(e) => dragEntered(e, index)}
                    onDragEnd={(e) => dragEndTeam(e, index)}
                  >
                    <Image
                      src={'/teams/' + item.ref + '.png'}
                      width={50}
                      height={50}
                    />
                  </div>
                ) : (
                  <div key={index}></div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-row justify-end">
          <button className="ml-4 border-2 border-black px-8 py-4 font-medium hover:bg-blue-700">
            Reset
          </button>

          <button className="ml-4 bg-black px-8 py-4 text-white font-medium hover:bg-blue-700">
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
