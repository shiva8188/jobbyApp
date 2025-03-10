import {Component} from 'react'

import {IoLocationSharp} from 'react-icons/io5'
import {IoMdStar} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const jobDetailsConstant = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class JobItemDetails extends Component {
  state = {
    responseStatus: jobDetailsConstant.initial,
    jobData: {},
    skills: [],
    lifeDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetailsData()
  }

  getJobDetailsData = async () => {
    this.setState({responseStatus: jobDetailsConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const details = data.job_details
      const {skills} = data.job_details
      const life = data.job_details.life_at_company
      const similarJobsData = data.similar_jobs

      const updateText = {
        title: details.title,
        companyLogo: details.company_logo_url,
        websiteUrl: details.company_website_url,
        companyType: details.employment_type,
        jobDescription: details.job_description,
        location: details.location,
        salaryPackage: details.package_per_annum,
        rating: details.rating,
      }
      const updateSkills = skills.map(each => ({
        skillImg: each.image_url,
        name: each.name,
      }))

      const updatedLife = {
        lifeImgUrl: life.image_url,
        description: life.description,
      }

      const updateSimilarJobs = similarJobsData.map(each => ({
        id: each.id,
        title: each.title,
        companyLogo: each.company_logo_url,
        companyType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
      }))

      this.setState({
        jobData: updateText,
        skills: updateSkills,
        lifeDetails: updatedLife,
        similarJobsData: updateSimilarJobs,
        responseStatus: jobDetailsConstant.success,
      })
    } else {
      this.setState({responseStatus: jobDetailsConstant.failure})
    }
  }

  getJobDetails = () => {
    const {jobData, skills, lifeDetails, similarJobsData} = this.state

    const {
      title,
      rating,
      companyLogo,
      companyType,
      salaryPackage,
      jobDescription,
      location,
      websiteUrl,
    } = jobData

    return (
      <div className="job-similarJobs-container">
        <div className="job-details">
          <div className="jobDetail-image-container">
            <img
              src={companyLogo}
              alt="job details company logo"
              className="detail-companyLogo"
            />
            <div className="Detailtitle-container">
              <h1 className="detailTitle">{title}</h1>
              <p className="detail-rating">
                <IoMdStar className="icon" /> {rating}
              </p>
            </div>
          </div>
          <div className="location-container">
            <div className="rating-type-container">
              <p className="detailLocation">
                <IoLocationSharp className="detailIcon" />
                {location}
              </p>
              <p className="detailLocation">
                <BsBriefcaseFill className="detailIcon" /> {companyType}
              </p>
            </div>
            <p className="detailSalary">{salaryPackage}</p>
          </div>
          <hr className="hr" />
          <div className="job-description-container">
            <div className="description-container">
              <h1 className="detail-heading">Description</h1>
              <a href={websiteUrl} target="_blank" rel="noreferrer">
                Visit{' '}
              </a>
            </div>
            <p className="details-description-text">{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1 className="skill-heading">Skills</h1>
            <ul className="skill-ul-container">
              {skills.map(each => (
                <li key={each.name} className="skill">
                  <img
                    src={each.skillImg}
                    alt={each.name}
                    className="skill-image"
                  />
                  <p className="skill-name">{each.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-container">
            <h1 className="skill-heading">Life at Company</h1>
            <div className="life-details-container">
              <p className="life-description">{lifeDetails.description}</p>
              <img
                src={lifeDetails.lifeImgUrl}
                alt="life at company"
                className="life-image"
              />
            </div>
          </div>
        </div>
        <div className="similarJobs-container">
          <h1 className="similarJobs-heading">Similar Jobs</h1>
          <ul className="similarJobs-ul-container">
            {similarJobsData.map(each => (
              <li className="similarJob" key={each.id}>
                <div className="jobDetail-image-container">
                  <img
                    src={each.companyLogo}
                    alt="similar job company logo"
                    className="detail-companyLogo"
                  />
                  <div className="Detailtitle-container">
                    <h1 className="detailTitle">{each.title}</h1>
                    <p className="detail-rating">
                      <IoMdStar className="icon" /> {each.rating}
                    </p>
                  </div>
                </div>
                <div className="similarJob-description-container">
                  <h1 className="similar-heading">Description</h1>
                  <p className="similar-description">{each.jobDescription}</p>
                </div>
                <div className="similar-location-container">
                  <p className="detailLocation">
                    <IoLocationSharp className="detailIcon" /> {each.location}
                  </p>
                  <p className="detailLocation">
                    <BsBriefcaseFill className="detailIcon" />{' '}
                    {each.companyType}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onRetry = () => {
    this.getJobDetailsData()
  }

  getFailure = () => (
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
      <button className="logout-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  getLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getResponse = () => {
    const {responseStatus} = this.state
    switch (responseStatus) {
      case jobDetailsConstant.failure:
        return this.getFailure()
      case jobDetailsConstant.inProgress:
        return this.getLoader()
      case jobDetailsConstant.success:
        return this.getJobDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobItem-details-container">{this.getResponse()}</div>
      </>
    )
  }
}

export default JobItemDetails
