const CourseCard = ({ course, onAction, actionLabel, onEdit, onDelete }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      
      <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        {onAction && actionLabel && (
          <button className="btn-action" onClick={() => onAction(course.id)}>
            {actionLabel}
          </button>
        )}
        {onEdit && (
          <button className="btn-edit" style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => onEdit(course)}>
            Edit
          </button>
        )}
        {onDelete && (
          <button className="btn-delete" style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => onDelete(course.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
