const CourseRepository = require("../repositories/courseRepository")
const SubjectRepository = require("../repositories/subjectRepository")
const TeacherRepository = require("../repositories/teacherRepository")

const SubjectController = {}

SubjectController.getSubjects = async (request, response) => {
    try {
        const result = await SubjectRepository.getSubjects()


        return response.status(200).json(result)
    } catch (error) {
        console.error(error)
        return response.status(500).json({
            message: 'Internal Server Error',
            error
        })
    }
}

SubjectController.createSubject = async (request,response) => {
    const {name, courseId} = request.body
    try {
        const [courseExist] = await CourseRepository.verifyIfExists(courseId)
    
        if(!courseExist) return response.status(400).json({ error: "Course not found"})
        const [subjectId] = await SubjectRepository.createSubject({name, courseId})
        return response.status(201).json({
            message:'Subject created successfully',
            subjectId
        })
    } catch (error) {
        console.error(error)
        return response.status(500).json({
            message: 'Internal Server Error',
            error
        })
    }
}
SubjectController.assignTeacher = async (request, response) => {
    const {subjectId, teacherId} = request.params
    try {
        const [subjectExist] = await SubjectRepository.verifyIfExists(subjectId)
        const [teacherExist] = await TeacherRepository.verifyIfExists(teacherId)

        if(!subjectExist) return response.status(400).json({ error: "Subject not found"})
        else if (!teacherExist) return response.status(400).json({ error: "Teacher not found"})

        await SubjectRepository.assignTeacher(subjectId, teacherId)
        return response.status(200).json({
            message:'Teacher assigned successfully'
        })
    } catch (error) {
        console.error(error)
        return response.status(500).json({
            message: 'Internal Server Error',
            error
        })
    }
}


SubjectController.updateSubject = async (request, response) => {
    const {subjectId} = request.params
    const {name, courseId, teacherId} = request.body
    try {
        const [courseExist] = await CourseRepository.verifyIfExists(courseId)
        const [teacherExist] = await TeacherRepository.verifyIfExists(teacherId)

        if(!courseExist) return response.status(400).json({ error: "Course not found"})
        else if (!teacherExist) return response.status(400).json({ error: "Teacher not found"})
        await SubjectRepository.updateSubject({name,subjectId, courseId, teacherId})

        return response.status(200).json({ 
            message: 'Subject updated successfully'
        })
    } catch (error) {
        console.error(error)
        return response.status(500).json({
            message: 'Internal Server Error',
            error
        })
    }
}
SubjectController.deleteSubject = async (request, response) => {
    const {subjectId} = request.params
    try {
        await SubjectRepository.deleteSubject(subjectId)

        return response.status(200).json({ 
            message: 'Subject deleted successfully'
        })
    } catch (error) {
        console.error(error)
        return response.status(500).json({
            message: 'Internal Server Error',
            error
        })
    }
}

module.exports = SubjectController