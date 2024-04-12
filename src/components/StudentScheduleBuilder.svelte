<!-- <svelte:options customElement="ps-student-schedule-builder" /> -->
<script>
  import { student } from '../data/student.js'
  import { course_catalog } from '../data/course_catalog.js'
  import CourseSelection from './CourseSelection.svelte'

  const semester_template = [
    { "display": "English", "department": ["EN"], "grade": ["9","10","11","12"]},
    { "display": "Math", "department": ["MA"], "grade": ["9","10","11","12"] },
    { "display": "Science", "department": ["SC"], "grade": ["9","10","11","12"] },
    { "display": "Social Studies", "department": ["SS"], "grade": ["9","10","11","12"] },
    { "display": "World Language", "department": ["WL"], "grade": ["9","10","11","12"] },
    { "display": "PE or Health/Fitness", "department": ["PE", "HF"], "grade": ["9"] },
    { "display": "PE", "department": ["PE"], "grade": ["10","11","12"]},
    { "display": "Elective", "department": ["EL"], "grade": ["9","10","11","12"]},
    { "display": "Elective", "department": ["EL"], "grade": ["9","10","11","12"]},
    { "display": "Elective", "department": ["EL"], "grade": ["9","10","11","12"]},
    { "display": "Elective / IP", "department": ["EL","IP"], "grade": ["9","10","11","12"]},
    { "display": "Music/Subject co-curricular", "department": ["CC"], "grade": ["9","10","11","12"]},
    { "display": "Music/Subject co-curricular", "department": ["CC"], "grade": ["9","10","11","12"]}
  ]

  // Add a course property to each course in the semester template
  semester_template.forEach(course => course.course = {course_number: ''})

  let s1 = [...semester_template]
  let s2 = [...semester_template]

  // // Filter for grade level
  s1 = s1.filter(course => course.grade.includes(student.grade))
  s2 = s2.filter(course => course.grade.includes(student.grade))

  let s1TotalUnits = 0;
  $: s1TotalUnits = s1.reduce((total, course) => total + parseFloat((course.course ?? {}).credit_hours || 0) || 0, 0);

  let s2TotalUnits = 0;
  $: s2TotalUnits = s2.reduce((total, course) => total + parseFloat((course.course ?? {}).credit_hours || 0) || 0, 0);


  function getCourses(course) {
    let courses = [];
    for (let cc of course_catalog) {
      if (course.department.includes(cc.sched_department)) {
        courses.push(cc);
      }
    }
    return courses;
  }


  function updateCourse(semesterId, index, event) {
    const selectedCourseNumber = event.target.value;
    const selectedCourse = course_catalog.find(course => course.course_number === selectedCourseNumber);
    const semester = semesterId === 'S1' ? s1 : s2;
    const updatedSemester = [...semester];
    updatedSemester[index].course = selectedCourse;

    // If the selected course is year-long
    if (selectedCourse.termsoffered.includes('-')) {
        // Find the corresponding course in the opposite semester
        const oppositeSemester = semesterId === 'S1' ? s2 : s1;
        const updatedOppositeSemester = [...oppositeSemester];
        const correspondingCourseIndex = updatedOppositeSemester.findIndex(course => course.department === selectedCourse.department);
        
        // If a corresponding course is found in the opposite semester
        if (correspondingCourseIndex !== -1) {
            // Set the course for the opposite semester
            updatedOppositeSemester[correspondingCourseIndex].course = selectedCourse;
        }

        // Update the opposite semester
        if (semesterId === 'S1') {
            s2 = updatedOppositeSemester;
        } else {
            s1 = updatedOppositeSemester;
        }
    }

    // Update the current semester
    if (semesterId === 'S1') {
        s1 = updatedSemester;
    } else {
        s2 = updatedSemester;
    }
  }

</script>

<main class="p-4">
  <div class="text-2xl w-full text-center">Schedule Builder</div>
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-1 font-bold">Semester 1</div>
    <div class="col-span-1 font-bold">Semester 2</div>
    <div class="col-span-1">
      <div class="grid grid-cols-3 gap-4">
        <div class="course-type">Course Type</div>
        <div class="course-type">Class / Level / Unit</div>
        <div class="course-type text-center">Unit</div>

        {#each s1 as course, i}
          <div class="col-span-1 flex items-center">
            {course.type == 'PE' || course.type == 'Health/Fitness' ? 'PE/Health/Fitness' : course.display}
          </div>
          <div class="col-span-1 flex items-center">
            <select class="w-full" bind:value={s1[i].course.course_number} on:change="{(event) => updateCourse('S1', i, event)}">
              <option value="">&nbsp;</option>
              {#each getCourses(course) as course_option}
                <option value={course_option.course_number}>{course_option.course_name} / {course_option.credittype} / {course_option.credit_hours}</option>
              {/each}
            </select>
          </div>
          <div class="col-span-1 flex items-center">
            {#if s1[i].course}
            {s1[i].course.credit_hours ?? ''}
            {/if}
          </div>
        {/each}
        <div class="col-span-1"></div>
        <div class="col-span-1 flex items-center">Total Semester 1 Units</div>
        <div class="col-span-1 flex items-center">{s1TotalUnits}</div>
      </div>
    </div>
    <div class="col-span-1">
      <div class="grid grid-cols-3 gap-4">
        <div class="course-type">Course Type</div>
        <div class="course-type">Class / Level / Unit</div>
        <div class="course-type text-center">Unit</div>

        {#each s2 as course, i}
          <div class="col-span-1 flex items-center">
            {course.type == 'PE' || course.type == 'Health/Fitness' ? 'PE/Health/Fitness' : course.display}
          </div>
          <div class="col-span-1 flex items-center">
            <select class="w-full" bind:value={s2[i].course.course_number} on:change="{(event) => updateCourse('S2', i, event)}">
              <option value="">&nbsp;</option>
              {#each getCourses(course) as course_option}
                <option value={course_option.course_number}>{course_option.course_name} / {course_option.credittype} / {course_option.credit_hours}</option>
              {/each}
            </select>
          </div>
          <div class="col-span-1 flex items-center">
            {#if s2[i].course}
            {s2[i].course.credit_hours ?? ''}
            {/if}
          </div>
        {/each}
        <div class="col-span-1"></div>
        <div class="col-span-1 flex items-center">Total Semester 2 Units</div>
        <div class="col-span-1 flex items-center">{s2TotalUnits}</div>
      </div>
    </div>
    <pre>
      {JSON.stringify(s2, null, 2)}
    </pre>
</main>

<style>
  main {
    font-family: 'DM Sans', sans-serif;
  }
</style>
