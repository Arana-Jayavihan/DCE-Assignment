using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Monty_Hall_API.Models.Domain;
using Monty_Hall_API.Models.DTO;
using Monty_Hall_API.Data;

namespace Monty_Hall_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MontyHallController : ControllerBase
    {
        private readonly ApiContext _context;

        public MontyHallController(ApiContext context)
        {
            _context = context;
        }

        [HttpGet("init")]
        public async Task<IActionResult> MontyHallInit()
        {
            MontyHall MontyHallInstance = new();
            var response = new MontyHallInitResponseDto
            {
                InstanceId = MontyHallInstance.InstanceId
            };

            await _context.MontyHallInstances.AddAsync(MontyHallInstance);
            await _context.SaveChangesAsync();
            return new JsonResult(Ok(response));
        }

        [HttpPost("select")]
        public async Task<IActionResult> DoorSelect(DoorDto request)
        {
            MontyHall MontyHallInstance = await _context.MontyHallInstances.FindAsync(request.InstanceId);
            if (MontyHallInstance != null)
            {
                if (MontyHallInstance.SelectedDoor == 0)
                {
                    bool result = MontyHallInstance.SelectDoor(request.DoorId);
                    if (result == true)
                    {
                        await _context.SaveChangesAsync();
                        return new JsonResult(Ok("Selection Success"));
                    }
                    else
                    {
                        return new JsonResult(BadRequest("Door Index Out of Range"));
                    }
                }
                else
                {
                    return new JsonResult(BadRequest("Already Selected"));
                }
            }
            else
            {
                return new JsonResult(NotFound("Instance Not Found"));
            }
        }

        [HttpPost("reveal")]
        public async Task<IActionResult> RevealDoor(Guid id)
        {
            MontyHall MontyHallInstance = await _context.MontyHallInstances.FindAsync(id);
            if (MontyHallInstance != null)
            {
                if (MontyHallInstance.OpenDoor == 0)
                {
                    var result = MontyHallInstance.RevealDoor();
                    await _context.SaveChangesAsync();
                    return new JsonResult(Ok(result));
                }
                else
                {
                    return new JsonResult(BadRequest("Already Revealed"));
                }
            }
            else
            {
                return new JsonResult(NotFound("Instance Not Found"));
            }
        }

        [HttpPost("finalSelect")]
        public async Task<IActionResult> FinalSelect(DoorDto request)
        {
            if (0 < request.DoorId && request.DoorId < 4)
            {
                MontyHall MontyHallInstance = await _context.MontyHallInstances.FindAsync(request.InstanceId);
                if (MontyHallInstance != null)
                {
                    string result = MontyHallInstance.FinalSelect(request.DoorId);
                    return new JsonResult(Ok(result));
                }
                else
                {
                    return new JsonResult(NotFound("Instance Not Found"));
                }
            }
            else
            {
                return new JsonResult(BadRequest("Door Index Out of Range"));
            }
        }
    }
}
