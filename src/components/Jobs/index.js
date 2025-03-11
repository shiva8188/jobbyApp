import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {IoMdStar} from 'react-icons/io'
import {IoLocationSharp} from 'react-icons/io5'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'

import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationOptions = [
  {locationId: 'Hyderabad'},
  {locationId: 'Bangalore'},
  {locationId: 'Chennai'},
  {locationId: 'Delhi'},
  {locationId: 'Mumbai'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

const jobsApiStatusConstant = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    apiStatus: apiStatusConstant.initial,
    salary: '',
    jobTypes: [],
    jobsListData: [],
    selectedLocations: [],
    jobApiStatus: jobsApiStatusConstant.initial,
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsList()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})

    const url = `https://apis.ccbp.in/profile`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const profileDetails = data.profile_details
    if (response.ok) {
      const updataProfiletext = {
        name: profileDetails.name,
        imageUrl: profileDetails.profile_image_url,
        bio: profileDetails.short_bio,
      }
      this.setState({
        profileDetails: updataProfiletext,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  getProfileSuccess = () => {
    const {profileDetails} = this.state
    return (
      <>
        <div className="profile-container">
          <img
            src={profileDetails.imageUrl}
            alt="profile"
            className="profile-image"
          />
          <h1 className="profile-heading">{profileDetails.name}</h1>
          <p className="profile-bio">{profileDetails.bio}</p>
        </div>
      </>
    )
  }

  onRetry = () => {
    this.getProfileData()
  }

  getProfileFailure = () => (
    <div>
      <button type="button" className="logout-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  getLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" className="#ffffff" height={50} weight={50} />
    </div>
  )

  getProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.inProgress:
        return this.getLoader()
      case apiStatusConstant.failure:
        return this.getProfileFailure()
      case apiStatusConstant.success:
        return this.getProfileSuccess()
      default:
        return null
    }
  }

  onHandleCheckbox = event => {
    if (event.target.checked) {
      const {jobTypes} = this.state
      this.setState(
        {jobTypes: [...jobTypes, event.target.id]},
        this.getJobsList,
      )
    } else {
      const {jobTypes} = this.state
      this.setState(
        {jobTypes: jobTypes.filter(each => each !== event.target.id)},
        this.getJobsList,
      )
    }
  }

  onHandleLocationCheckbox = event => {
    if (event.target.checked) {
      this.setState(prev => ({
        selectedLocations: [...prev.selectedLocations, event.target.value],
      }))
    } else {
      this.setState(prev => ({
        selectedLocations: prev.selectedLocations.filter(
          each => each !== event.target.value,
        ),
      }))
    }
  }

  onHandleSalary = event => {
    console.log(event.target.value)
    this.setState({salary: event.target.value}, this.getJobsList)
  }

  getJobsList = async () => {
    this.setState({jobApiStatus: jobsApiStatusConstant.inProgress})

    const {jobTypes, salary, searchInput} = this.state
    const joinedData = jobTypes.join(',')

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${joinedData}&minimum_package=${salary}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const updatedJobText = data.jobs.map(each => ({
        companyLogo: each.company_logo_url,
        companyType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        salaryPackage: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsListData: updatedJobText,
        jobApiStatus: jobsApiStatusConstant.success,
      })
    } else {
      this.setState({jobApiStatus: jobsApiStatusConstant.failure})
    }
  }

  getJobItem = () => {
    const {jobsListData, selectedLocations} = this.state
    const filtered =
      selectedLocations.length > 0
        ? jobsListData.filter(each => selectedLocations.includes(each.location))
        : jobsListData

    return filtered.map(each => (
      <Link to={`/jobs/${each.id}`} className="link" key={each.id}>
        <li className="job-item">
          <div className="job-image-container">
            <img
              src={each.companyLogo}
              alt="company logo"
              className="companyLogo"
            />
            <div className="title-container">
              <h1 className="title">{each.title}</h1>
              <p className="job-rating">
                <IoMdStar className="icon" /> {each.rating}
              </p>
            </div>
          </div>
          <div className="location-container">
            <div className="rating-type-container">
              <p className="location">
                <IoLocationSharp className="location" /> {each.location}
              </p>
              <p className="type">{each.companyType}</p>
            </div>
            <p className="salary">{each.salaryPackage}</p>
          </div>
          <hr className="hr" />
          <div className="job-description-container">
            <h1 className="job-heading">Description</h1>
            <p className="job-description-text">{each.jobDescription}</p>
          </div>
        </li>
      </Link>
    ))
  }

  getJobSuccess = () => {
    const {jobsListData} = this.state

    if (jobsListData.length > 0) {
      return this.getJobItem()
    }
    return this.getNoJobs()
  }

  getJobLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" className="#ffffff" height={50} weight={50} />
    </div>
  )

  onRetryJobs = () => {
    this.getJobsList()
  }

  getJobFailure = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="logout-button"
        onClick={this.onRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  getNoJobs = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="job-failure-image"
      />
      <h1 className="failure-heading">NO Jobs Found</h1>
      <p className="failure-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  getJobsStatus = () => {
    const {jobApiStatus} = this.state
    switch (jobApiStatus) {
      case jobsApiStatusConstant.failure:
        return this.getJobFailure()
      case jobsApiStatusConstant.inProgress:
        return this.getJobLoader()
      case jobsApiStatusConstant.success:
        return this.getJobSuccess()
      default:
        return null
    }
  }

  onChangeInputValue = event => {
    this.setState({searchInput: event.target.value})
    if (!event.target.value) {
      this.getJobsList()
    }
  }

  getSearchInput = () => {
    this.getJobsList()
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-main-container">
          <div className="profile-salary-container">
            {this.getProfileStatus()}
            <hr />
            <div className="job-type-container">
              <h1 className="type-heading">Type of Employment</h1>
              <ul className="checkbox-container">
                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId} className="checkbox-list">
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      onChange={this.onHandleCheckbox}
                      className="checkbox"
                    />
                    <label
                      htmlFor={each.employmentTypeId}
                      className="checkbox-label"
                    >
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="job-type-container">
              <h1 className="type-heading">Salary Range</h1>
              <ul className="checkbox-container">
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId} className="checkbox-list">
                    <input
                      type="radio"
                      id={each.salaryRangeId}
                      className="checkbox"
                      name="salary"
                      onChange={this.onHandleSalary}
                      value={each.salaryRangeId}
                    />
                    <label
                      htmlFor={each.salaryRangeId}
                      className="checkbox-label"
                    >
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="job-type-container">
              <h1 className="type-heading">Location</h1>
              <ul className="checkbox-container">
                {locationOptions.map(each => (
                  <li key={each.locationId} className="checkbox-list">
                    <input
                      type="checkbox"
                      id={each.locationId}
                      value={each.locationId}
                      className="checkbox"
                      onChange={this.onHandleLocationCheckbox}
                    />
                    <label htmlFor={each.locationId}>{each.locationId}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobList-container">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeInputValue}
              />
              <button
                type="button"
                className="searchButtonDesign"
                data-testid="searchButton"
                onClick={this.getSearchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <ul className="jobList-ul-container">{this.getJobsStatus()}</ul>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
