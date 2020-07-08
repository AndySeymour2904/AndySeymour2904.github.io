import React, { useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'

import { Typography, InputBase } from '@material-ui/core'

import useWindowSize from '../hooks/windowSize'

import SearchIcon from '@material-ui/icons/Search'

import ReactWordcloud from 'react-wordcloud'
import words from '../content/words'

const useStyles = makeStyles(theme => ({
   root: {
        position: 'relative',
        backgroundColor: 'white',
        paddingLeft: theme.gutter,
        paddingRight: theme.gutter,
        paddingBottom: theme.padding.containerBottom,
   },
   title: {
       paddingTop: theme.padding.titleTop,
       paddingBottom: theme.padding.titleBottom,
       textAlign: 'center',
   },
   searchContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '50px',
   },
   search: {
        position: 'relative',
        borderRadius: '5px',
        backgroundColor: fade('#808080', 0.15),
        '&:hover': {
        backgroundColor: fade('#808080', 0.25),
        },
        width: 'fit-content',
  },
  searchIcon: {
        padding: '0 14px',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
  },
  inputRoot: {
        color: 'inherit',
  },
  inputInput: {
        padding: '7px 7px 7px 0',
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + 28px)`,
        width: '100%',
  },
  wordCloudContainer: {
        margin: '0 auto',
        maxWidth: '1500px',
        paddingRight: '10vw',
  },
}))

export default function Skills() {

    const windowSize = useWindowSize()

    const classes = useStyles()
    const [filter, setFilter] = React.useState('')

    const [filteredWords, setFilteredWords] = React.useState(words)

    const effectiveCloudWidth = Math.min(windowSize.width, 1600)

    const maxFontSize = Math.sqrt(effectiveCloudWidth) * 2
    const minFontSize = filteredWords.length > 5 ? Math.max(Math.sqrt(effectiveCloudWidth) / 4, 10) : maxFontSize

    let timeoutHandler = null

    // react-word-cloud exit fn sometimes leaves words with 0 opacity even once they re-enter
    useEffect(() => {
        if (!timeoutHandler) {
            timeoutHandler = setTimeout(() => {
                timeoutHandler = null

                const newFilteredWords = words.filter(word => word.text.toUpperCase().indexOf(filter.toUpperCase()) !== -1)

                if (JSON.stringify(filteredWords) !== JSON.stringify(newFilteredWords)) {
                    setFilteredWords(newFilteredWords)
                }
            }, 550)

            return () => {
                clearTimeout(timeoutHandler)
            }
        } else {
            return
        }
    }, [ filter ])

    return (
        <div className={classes.root} id="skills">
            <Typography classes={{root: classes.title}} variant='h3'>Skills</Typography>
            <div className={classes.searchContainer}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        value={filter}
                        onChange={event => setFilter(event.target.value)}
                    />
                </div>
            </div>
            <div className={classes.wordCloudContainer}>
                <ReactWordcloud
                    options={{
                        rotations: 1,
                        enableOptimizations: true,
                        fontSizes: [minFontSize, maxFontSize],
                        deterministic: true,
                        enableTooltip: false,
                        transitionDuration: 500,
                        scale: 'sqrt',
                        spiral: 'rectangular',
                        rotationAngles: [0, 0],
                        colors: ['#005073', '#107dac', '#189ad3', '1ebbd7', '#71c7ec']
                    }}
                    words={filteredWords}
                />
            </div>
        </div>
    )
}