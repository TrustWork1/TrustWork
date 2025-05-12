import { Box, Button, Menu, MenuItem, Stack, styled, Typography } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import React from 'react'

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

const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const AppCalendar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <CustomCalenderStyled>
      <Box className='tableTop'>
        <Stack direction='row' alignItems='center' className='employeeDetails'>
          <Typography variant='h4'>TrustWork</Typography>
          <Typography variant='body1'>
            Thu 1 Aug 2024 | <span>31 Days</span> | <span>55 employees</span>
          </Typography>
        </Stack>

        <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
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

          <Stack direction='row' className='employeesInput'>
            <Stack direction='column' className='employeesInputBox'>
              <label>Sort employees by...</label>
              <Box className='inputBox'>
                <input type='text' placeholder='First name (A - Z)' />
              </Box>
            </Stack>
            <Stack direction='column'>
              <label>Filter by shifts</label>
              <Box className='inputBox'>
                <Icon icon='tabler:search' fontSize={20} />
                <input type='text' placeholder='Name, job title, team' />
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Box className='tableWrap'>
        <TableContainer component={Paper}>
          <Table aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell className='stickyLeft'>
                  <Box className='inputBox'>
                    <Icon icon='tabler:search' fontSize={20} />
                    <input type='text' placeholder='Name, job title, team' />
                  </Box>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      <strong>20 Aug</strong>
                    </Typography>
                    <Typography variant='body1'>Wed</Typography>
                  </Stack>
                </TableCell>
                <TableCell align='center' className='stickyRight'>
                  <Stack direction='column' alignItems='center' justifyContent='center'>
                    <Typography>Total hours</Typography>
                    <Typography>Incl. breaks?</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map(row => (
                <TableRow key={row}>
                  <TableCell className='stickyLeft'>
                    <Stack direction='row' alignItems='center' className='profileDetails'>
                      <Icon icon='tabler:user-circle' fontSize={20} />
                      <Stack direction='column' className='profileTxt'>
                        <Typography variant='h4'>Abiskar Parajuli</Typography>
                        <Typography variant='body1'>Healthcare Assistant</Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell align='center'>gf</TableCell>
                  <TableCell align='center'>gd</TableCell>
                  <TableCell align='center'>fhsdfg</TableCell>
                  <TableCell align='center'>fghyrtg</TableCell>
                  <TableCell align='center'>fghfg</TableCell>
                  <TableCell align='center'>gf</TableCell>
                  <TableCell align='center'>gd</TableCell>
                  <TableCell align='center'>fhsdfg</TableCell>
                  <TableCell align='center'>hjgh</TableCell>
                  <TableCell align='center'>fghfg</TableCell>
                  <TableCell align='center'>gf</TableCell>
                  <TableCell align='center'>gd</TableCell>
                  <TableCell align='center'>fhsdfg</TableCell>
                  <TableCell align='center'>hjgh</TableCell>
                  <TableCell align='center' className='stickyRight'>
                    1 hrs
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className='nextArrow'>
          <Button type='button'>
            <Icon icon='tabler:circle-arrow-right' fontSize={18} />
          </Button>
        </Box>
        <Box className='prevArrow'>
          <Button type='button'>
            <Icon icon='tabler:circle-arrow-left' fontSize={18} />
          </Button>
        </Box>
      </Box>
    </CustomCalenderStyled>
  )
}

export default AppCalendar
