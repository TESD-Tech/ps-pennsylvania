<script>
  export let semester;
  export let courses = []; // Default to an empty array if no value is provided
  export let updateCourse;
  export let getCourses;
  export let student;
</script>

{#if Array.isArray(courses)} <!-- Check if courses is an array -->
  {#each courses as course, i}
    <div class="col-span-1 flex items-center">
      {course.type == 'PE' || course.type == 'Health/Fitness' ? 'PE/Health/Fitness' : course.display}
    </div>
    <div class="col-span-1 flex items-center">
      <select class="w-full" on:change="{(event) => updateCourse(semester, i, event)}">
        <option value="">&nbsp;</option>
        {#each getCourses(course) as course_option}
          <option value={course_option.course_number}>{course_option.course_name} / {course_option.credittype} / {course_option.credit_hours}</option>
        {/each}
      </select>
    </div>
    <div class="col-span-1 flex items-center">
      {#if courses[i].course}
      {courses[i].course.credit_hours ?? ''}
      {/if}
    </div>
  {/each}
{/if}