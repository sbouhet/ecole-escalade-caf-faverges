<div>Date de naissance : {dayjs(student.private.dateOfBirth).format('D MMMM YYYY')}</div>
            {#each student.private.parents as parent}
                <div>
                    <div><b>{printName(parent)}</b></div>
                    <div>{translateRole(parent.role)}</div>
                </div>
            {/each}
