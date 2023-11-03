import React from 'react'

const page = () => {
  return (
    <div>
      <div class="overflow-x-auto">
  <table class="table-auto min-w-full">
    <thead>
      <tr>
        <th class="px-4 py-2">Hackathon Name</th>
        <th class="px-4 py-2">Date</th>
        <th class="px-4 py-2">Deadline</th>
        <th class="px-4 py-2">Location</th>
        <th class="px-4 py-2">Link</th>
        <th class="px-4 py-2">Description</th>
        <th class="px-4 py-2">Apply</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border px-4 py-2">CodeFest 2023</td>
        <td class="border px-4 py-2">November 15, 2023</td>
        <td class="border px-4 py-2">November 10, 2023</td>
        <td class="border px-4 py-2">Virtual</td>
        <td class="border px-4 py-2">
          <a href="https://codefest2023.com" target="_blank" class="text-blue-500">Website</a>
        </td>
        <td class="border px-4 py-2">CodeFest 2023 is a global hackathon focusing on innovation and coding challenges.</td>
        <td class="border px-4 py-2">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Apply
          </button>
        </td>
      </tr>
      <tr>
        <td class="border px-4 py-2">HackX 2023</td>
        <td class="border px-4 py-2">December 3, 2023</td>
        <td class="border px-4 py-2">November 25, 2023</td>
        <td class="border px-4 py-2">New York, NY</td>
        <td class="border px-4 py-2">
          <a href="https://hackx2023.com" target="_blank" class="text-blue-500">Website</a>
        </td>
        <td class="border px-4 py-2">Join HackX 2023 to compete with innovators and developers from around the world.</td>
        <td class="border px-4 py-2">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Apply
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
  )
}

export default page
