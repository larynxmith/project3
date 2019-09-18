import React from 'react'
import axios from 'axios'
import BASE_URL from '../../constants';



class  TagSearch extends React.Component {

    state = {
        tagsInput: '',
        mentors: [],
        mentees: []

    }

    handleChange = (e) => {
        this.setState({tagsInput: e.target.value})
    }

    searchList = (e) => {
        e.preventDefault()
        let token = localStorage.getItem('authToken')
        let trimmedStrings = this.state.tagsInput.split(',').map(str => str.trim())

        axios.post(`${BASE_URL}/profiles/search`, 
            {
            tags: trimmedStrings
            }, 
            {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        .then(response => {
            console.log('SUCCESS', response.data.foundUsers)
            let mentors = []
            let mentees = []
            
            console.log(trimmedStrings)
            response.data.foundUsers.forEach(user => {
                // checking for an intersection of the searched tag within the user's mentorTag array
                let intersectedTags = user.mentorTag.filter(tags => trimmedStrings.includes(tags))
                // if present, push user into mentors array
                if(intersectedTags.length) {
                    console.log('Adding to mentors: ', intersectedTags, user.mentorTag)
                    mentors.push(user)
                }
                // then repeat process for mentees array
                intersectedTags = user.menteeTag.filter(tags => trimmedStrings.includes(tags))
                if (intersectedTags.length) {
                    mentees.push(user)
                }
            })
            this.setState({ mentors: mentors, mentees: mentees })
        })
    }
    render () {
        let mentorsList = (this.state.mentors.map((m, i) => {
            return (
                <ul key={i}>
                    <li>
                        {m.firstname} {m.lastname} -- {m.mentorTag.join(', ')}
                    </li>
                </ul>
            )
        }))

        let menteesList = (this.state.mentees.map((m, i) => {
            return (
                <ul key={i}>
                    <li>
                        {m.firstname} {m.lastname} -- {m.menteeTag.join(', ')}
                    </li>
                </ul>
            )
        }))

    return(
        <div>
            <form onSubmit={this.searchList}>
                <label htmlFor="tag-search">Tag Search:</label>
                <input type="text" name="tag-search" value={this.state.tagsInput} onChange={this.handleChange} />
                <button type="submit">Search Tags</button>
            </form>
            <hr />
            <h3>Here is a List of Mentors: </h3>
            <h4>{mentorsList}</h4>
            <h3>Here is a List of Other Mentees: </h3>
            <h4>{menteesList}</h4>
            <hr />
        </div>
        )
    }
}

export default TagSearch