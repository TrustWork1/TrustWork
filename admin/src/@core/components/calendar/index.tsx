import React, { useState, useEffect } from 'react'
import moment, { Moment } from 'moment'
import {
  Box,
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
  Menu,
  styled,
  Popover
} from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Icon from 'src/@core/components/icon'

const CustomCalenderStyled = styled(Box)`
  background: #fff;
  padding: 15px;
  box-shadow: 0px 2px 6px 0px rgba(47, 43, 61, 0.14);
  border-radius: 6px;
  .tableTop {
    border-bottom: 1px solid #ccc;
    padding-bottom: 15px;
    .employeeDetails {
      margin-bottom: 10px;
      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
        padding-right: 10px;
      }
      p {
        font-size: 14px;
        font-weight: 600;
        color: #7e7e7e;
      }
    }

    .dropDownWrap {
      .shiftBtn {
        background: #54a9dd;
        color: #fff;
      }
      .dropDownList {
        margin: 0 15px;
        button {
          padding: 0;
          background: transparent;
        }
      }
    }

    .employeesInput {
      .employeesInputBox {
        margin-right: 10px;
      }
      label {
        font-size: 12px;
        margin-bottom: 5px;
        display: block;
      }
    }
  }

  table {
    width: 100%;
    border-spacing: 1px;
    position: relative;
    tr {
      &:last-child {
        td {
          border-bottom: none;
        }
      }
    }
    th {
      border-bottom: 1px solid #b4b4b4;
      border-right: 1px solid #e7e7e7;
      padding: 5px 10px;
      &:last-child {
        border-right: none;
      }
      p {
        font-size: 12px;
      }
    }
    td {
      border-bottom: 1px solid #e7e7e7;
      border-right: 1px solid #e7e7e7;
      padding: 5px 10px;
      min-width: 143px;
      &:last-child {
        border-right: none;
      }
    }

    .stickyLeft {
      position: sticky;
      left: 0;
      background: #fff;
      min-width: 200px;
    }

    .stickyRight {
      position: sticky;
      right: 0;
      background: #f7fbff;
    }
  }

  .tableWrap {
    max-height: 580px;
    overflow: auto;
    position: relative;
    margin-top: 15px;
    .MuiTableContainer-root {
      border-radius: 0;
    }

    .nextArrow {
      button {
        position: absolute;
        top: 17px;
        right: 136px;
        padding: 0;
        min-width: auto;
        z-index: 9;
        svg {
          color: #fff;
          font-size: 15px;
          background: #54a9dd;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          padding: 2px;
        }
      }
    }

    .prevArrow {
      button {
        position: absolute;
        top: 17px;
        left: 190px;
        z-index: 9;
        padding: 0;
        min-width: auto;
        svg {
          color: #fff;
          font-size: 15px;

          background: #54a9dd;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          padding: 2px;
        }
      }
    }
  }

  .profileDetails {
    svg {
      background: #54a9dd;
      border-radius: 50%;
      color: #fff;
      width: 30px;
      height: 30px;
      padding: 3px;
    }
    .profileTxt {
      padding-left: 5px;
      h4 {
        font-size: 14px;
      }
      p {
        font-size: 12px;
      }
    }
  }

  .inputBox {
    border: 1px solid #ccc;
    padding: 10px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    background: #fff;
    min-height: 42px;
    svg {
      padding-right: 5px;
    }
    input {
      width: 100%;
      border: none;
      width: 100%;
      background: transparent;
      &:focus {
        outline: none;
      }
    }
  }

  .moreitems {
    border-radius: 3px;
    cursor: pointer;
    line-height: 1;
    margin-top: 1px;
    max-width: 100%;
    overflow: hidden;
    padding: 2px;
    position: relative;
    white-space: nowrap;
    z-index: 4;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`

// Types
interface EventDetails {
  date: string
  event: string
  duration?: number
}

interface Events {
  [date: string]: {
    [resourceId: string]: EventDetails[]
  }
}

interface Row {
  _id: string
  name: string
  service: string
  events?: EventDetails[]
}

interface ComponentData {
  page_title: string
  table_resource_title: string
}

interface CalendarProps {
  rows: Row[]
  data: ComponentData
}

const Calendar: React.FC<CalendarProps> = ({ rows, data }) => {
  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentWeek, setCurrentWeek] = useState<Moment>(moment())
  const [events, setEvents] = useState<Events>({})
  const [isAddEventPopupOpen, setIsAddEventPopupOpen] = useState(false)
  const [newEventDetails, setNewEventDetails] = useState('')
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null)
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [filterText, setFilterText] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [anchorElMoreEvents, setAnchorElMoreEvents] = useState<HTMLElement | null>(null)
  const [selectedMoreEvents, setSelectedMoreEvents] = useState<EventDetails[]>([])
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<EventDetails | null>(null)

  const open = Boolean(anchorEl)

  // Effects
  useEffect(() => {
    const parsedEvents: Events = {}
    rows.forEach(row => {
      row.events?.forEach(event => {
        const formattedDate = moment(event.date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        if (!parsedEvents[formattedDate]) {
          parsedEvents[formattedDate] = {}
        }
        if (!parsedEvents[formattedDate][row._id]) {
          parsedEvents[formattedDate][row._id] = []
        }
        parsedEvents[formattedDate][row._id].push({ date: event.date, event: event.event, duration: event.duration })
      })
    })
    setEvents(parsedEvents)
  }, [rows])

  // Helper functions
  const getWeekDays = () => {
    const startOfWeek = currentWeek.clone().startOf('week')

    return Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, 'days'))
  }

  const weekDays = getWeekDays()
  const today = moment().startOf('day')

  // Event handlers
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek.clone().add(1, 'week'))
  }

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek.clone().subtract(1, 'week'))
  }

  const handleCellClick = (date: Moment, resourceId: string) => {
    setSelectedDate(date)
    setSelectedResource(resourceId)
    setIsAddEventPopupOpen(true)
  }

  const handleAddEvent = () => {
    if (selectedDate && selectedResource && newEventDetails) {
      const dateKey = selectedDate.format('YYYY-MM-DD')
      setEvents(prevEvents => ({
        ...prevEvents,
        [dateKey]: {
          ...prevEvents[dateKey],
          [selectedResource]: [
            ...(prevEvents[dateKey]?.[selectedResource] || []),
            { date: selectedDate.format('DD-MM-YYYY'), event: newEventDetails }
          ]
        }
      }))
      setIsAddEventPopupOpen(false)
      setNewEventDetails('')
    }
  }

  const handleClosePopup = () => {
    setIsAddEventPopupOpen(false)
    setNewEventDetails('')
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value)
  }

  const handleSortOrderChange = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'))
  }

  const handleMoreEventsClick = (event: React.MouseEvent<HTMLElement>, date: Moment, resourceId: string) => {
    event.stopPropagation()
    const dateKey = date.format('YYYY-MM-DD')
    const eventsForDay = events[dateKey]?.[resourceId] || []
    setSelectedMoreEvents(eventsForDay)
    setAnchorElMoreEvents(event.currentTarget)
  }

  const handleCloseMoreEventsPopover = () => {
    setAnchorElMoreEvents(null)
  }

  const handleEventClick = (event: EventDetails) => {
    setSelectedDetailEvent(event)
    handleCloseMoreEventsPopover()
  }

  const handleCloseDetailPopup = () => {
    setSelectedDetailEvent(null)
  }

  // Filtered and sorted rows
  const filteredAndSortedRows = rows
    .filter(
      row =>
        row.name.toLowerCase().includes(filterText.toLowerCase()) ||
        row.service.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)

      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Calculate total hours for each employee
  const calculateTotalHours = (resourceId: string) => {
    let totalHours = 0
    weekDays.forEach(day => {
      const dateKey = day.format('YYYY-MM-DD')
      const dayEvents = events[dateKey]?.[resourceId] || []
      dayEvents.forEach(event => {
        totalHours += event.duration || 0
      })
    })

    return totalHours
  }

  return (
    <CustomCalenderStyled>
      {/* Header section */}
      <Box className='tableTop'>
        <Stack direction='row' alignItems='center' className='employeeDetails'>
          <Typography variant='h4'>{data.page_title}</Typography>
          <Typography variant='body1'>
            {weekDays[0].format('ddd D MMM YYYY')} - {weekDays[6].format('ddd D MMM YYYY')}
          </Typography>
        </Stack>

        <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
          {/* Buttons and dropdowns */}
          <Stack direction='row' alignItems='center' className='dropDownWrap'>
            <Button type='button' className='shiftBtn'>
              Add/Manager shifts
            </Button>
            <Box className='dropDownList'>
              <Button
                id='basic-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                Shifts
                <Icon icon='tabler:caret-down' />
              </Button>
              <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </Box>
            <Box className='dropDownList'>
              <Button
                id='basic-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                Employees
                <Icon icon='tabler:caret-down' />
              </Button>
              <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </Box>
            <Box className='dropDownList'>
              <Button
                id='basic-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                Summary
                <Icon icon='tabler:caret-down' />
              </Button>
              <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </Box>
          </Stack>

          {/* Filters and sorting */}
          <Stack direction='row' className='employeesInput'>
            <Stack direction='column' className='employeesInputBox'>
              <label>Sort employees by...</label>
              <Box className='inputBox' onClick={handleSortOrderChange} style={{ cursor: 'pointer' }}>
                <Typography>
                  Name ({sortOrder === 'asc' ? 'A - Z' : 'Z - A'})
                  <Icon icon={sortOrder === 'asc' ? 'tabler:sort-ascending' : 'tabler:sort-descending'} />
                </Typography>
              </Box>
            </Stack>
            <Stack direction='column'>
              <label>Filter by shifts</label>
              <Box className='inputBox'>
                <Icon icon='tabler:search' fontSize={20} />
                <input
                  type='text'
                  placeholder='Name, job title, team'
                  value={filterText}
                  onChange={handleFilterChange}
                />
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Calendar table */}
      <Box className='tableWrap'>
        <TableContainer component={Paper}>
          <Table aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell className='stickyLeft'>{data.table_resource_title}</TableCell>
                {weekDays.map(day => (
                  <TableCell key={day.format('YYYY-MM-DD')} align='center'>
                    <Stack direction='column' alignItems='center'>
                      <Typography variant='body1'>
                        <strong>{day.format('D MMM')}</strong>
                      </Typography>
                      <Typography variant='body1'>{day.format('ddd')}</Typography>
                    </Stack>
                  </TableCell>
                ))}
                <TableCell align='center' className='stickyRight'>
                  Total hours
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAndSortedRows.map(row => (
                <TableRow key={row._id}>
                  <TableCell className='stickyLeft'>
                    <Stack direction='row' alignItems='center'>
                      <Icon icon='tabler:user-circle' fontSize={20} />
                      <Stack direction='column' className='profileTxt'>
                        <Typography variant='h4'>{row.name}</Typography>
                        <Typography variant='body1'>{row.service}</Typography>
                      </Stack>
                    </Stack>
                  </TableCell>

                  {weekDays.map(day => {
                    const dayKey = day.format('YYYY-MM-DD')
                    const eventDetails = events[dayKey]?.[row._id]
                    const isToday = day.isSame(today, 'day')

                    return (
                      <TableCell
                        key={day.format('YYYY-MM-DD')}
                        align='center'
                        onClick={() => handleCellClick(day, row._id)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: eventDetails ? '#e0f7fa' : isToday ? '#fff9c4' : '#fff'
                        }}
                      >
                        {eventDetails && eventDetails.length > 0 ? (
                          <>
                            {eventDetails.slice(0, 2).map((event, index) => (
                              <Chip
                                key={index}
                                label={`${event.event} (${event.duration || 0}h)`}
                                size='small'
                                style={{ marginBottom: '4px', cursor: 'pointer' }}
                                onClick={e => {
                                  e.stopPropagation()
                                  handleEventClick(event)
                                }}
                              />
                            ))}
                            {eventDetails.length > 2 && (
                              <Typography
                                className='moreitems'
                                variant='body2'
                                onClick={e => handleMoreEventsClick(e, day, row._id)}
                              >
                                +{eventDetails.length - 2} more
                              </Typography>
                            )}
                          </>
                        ) : (
                          ''
                        )}
                      </TableCell>
                    )
                  })}

                  <TableCell align='center' className='stickyRight'>
                    {calculateTotalHours(row._id)} hrs
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className='nextArrow'>
          <Button type='button' onClick={handleNextWeek}>
            <Icon icon='tabler:circle-arrow-right' fontSize={18} />
          </Button>
        </Box>
        <Box className='prevArrow'>
          <Button type='button' onClick={handlePreviousWeek}>
            <Icon icon='tabler:circle-arrow-left' fontSize={18} />
          </Button>
        </Box>
      </Box>

      {/* Event Details Popup */}
      <Dialog open={!!selectedDetailEvent} onClose={handleCloseDetailPopup}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedDetailEvent && (
            <>
              <Typography variant='h6'>{selectedDetailEvent.event}</Typography>
              <Typography>Date: {selectedDetailEvent.date}</Typography>
              <Typography>Duration: {selectedDetailEvent.duration || 0}h</Typography>
              {/* Add more details as needed */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailPopup}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Event Popup */}
      <Dialog open={isAddEventPopupOpen} onClose={handleClosePopup}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            label='Event Details'
            value={newEventDetails}
            onChange={e => setNewEventDetails(e.target.value)}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Duration (hours)'
            type='number'
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
            margin='normal'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Cancel</Button>
          <Button onClick={handleAddEvent} variant='contained'>
            Add Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* More Events Popover */}
      <Popover
        open={Boolean(anchorElMoreEvents)}
        anchorEl={anchorElMoreEvents}
        onClose={handleCloseMoreEventsPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant='h6' gutterBottom>
            {selectedMoreEvents.length > 0
              ? moment(selectedMoreEvents[0].date, 'DD-MM-YYYY').format('MMMM D, YYYY')
              : ''}
          </Typography>
          {selectedMoreEvents.map((event, index) => (
            <Chip
              key={index}
              label={`${event.event} (${event.duration || 0}h)`}
              size='small'
              style={{ margin: '4px', cursor: 'pointer' }}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </Box>
      </Popover>
    </CustomCalenderStyled>
  )
}

export default Calendar
